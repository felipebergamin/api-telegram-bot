'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const EventEmitter = require('events');
const debug = require('debug')('api-telegram-bot');
const request = require('request-promise');
const InlineKeyboardMarkup = require('./keyboards/InlineKeyboardMarkup');
const ReplyKeyboardMarkup = require('./keyboards/ReplyKeyboardMarkup');
const ReplyKeyboardRemove = require('./keyboards/ReplyKeyboardRemove');
const ForceReply = require('./keyboards/ForceReply');
let emojify = require('node-emoji').emojify;

const _messageTypes = [
	'text', 'audio', 'document', 'photo', 'sticker', 'video', 'voice', 'contact',
	'location', 'new_chat_participant', 'left_chat_participant', 'new_chat_title',
	'new_chat_photo', 'delete_chat_photo', 'group_chat_created'
];
const _updateTypes = [
	'message', 'edited_message', 'channel_post', 'edited_channel_post',
	'inline_query', 'chosen_inline_result', 'callback_query'
];

class TelegramBotClient extends EventEmitter {

	/**
	 * Constructs bot client
	 *
	 * @class TelegramBotClient
	 * @constructor
	 * @param {String} token Bot token
	 * @param {object} [config={}] Optional config object. See default configuration below
	 * @param {boolean} [config.onlyFirstRegexMatch=true] `true` for execute only first callback whose RegExp returns true. `false` will execute all matches. (see .onRegex())
	 * @param {boolean} [config.split_long_messages=false] Telegram messages can't be longer than 4096 chars, if `true`, the sendMessage function will split long messages and send sequentially
	 * @param {boolean} [config.emojify_texts=false] `true` if you want the bot automatically call [emoji.emojify](https://www.npmjs.com/package/node-emoji) in texts
	 * 
	 * @see {@link https://www.npmjs.com/package/node-emoji}
	 */
	constructor(token, config={}/*onlyFirstRegexMatch, split_long_messages*/) {
		super();
		debug('constructing TelegramBotClient');
		
		if (!token)
			throw new Error('bot token undefined');
		
		this.bot_token = token;
		
		this.max_msg_length = 4096;
		
		this.regexCallbacks = [];
		this.onlyFirstRegexMatch = config.onlyFirstRegexMatch || true;
		this.split_long_messages = config.split_long_messages || false;
		this.emojify_texts = config.emojify_texts || false;
		
		if (!this.emojify_texts)
			emojify = text=>text;
		
		/** @member {InlineKeyboardMarkup} */
		this.InlineKeyboardMarkup = InlineKeyboardMarkup;
		/** @member {ReplyKeyboardMarkup} */
		this.ReplyKeyboardMarkup = ReplyKeyboardMarkup;
		/** @member {ReplyKeyboardRemove} */
		this.ReplyKeyboardRemove = ReplyKeyboardRemove;
		/** @member {force_reply} */
		this.ForceReply = ForceReply;

		this.on('message', this._processMessageType);
		this.on('message', this._checkRegexCallbacks);
	}
	
	/**
	 * Create Webhook
	 * 
	 * @param {Object} config Configuration object
	 * @param {String} config.path='/<bot_token>' Path for webhook listen on
	 * @param {Number} config.port=80 Port for http server listen
	 * @param {Express} [expressApp] Optional. Personal express app. You must set bodyparser middleware by yourself for webhook works.
	 */
	createWebhook (config) {
		config = config || {};
		const path = config.path || `/${this.bot_token}`;
		const port = config.port || 80;
		
		// se o programador definiu um objeto express personalizado
		if (config.expressApp) {
			// apenas salva a referência desse objeto
			this._expressServer = config.expressApp;
		}
		else { // se não foi informado um objeto express
			// cria um novo objeto e seta o middleware bodyparser
			this._expressServer = express();
			this._expressServer.use(bodyparser.json());
		}

		// define a rota que escutará por updates do Telegram
		this._expressServer.post(path, (req, res)=>{
			debug('Post received');
			debug(JSON.stringify(req.body, null, 4));
			this._processUpdateType(req.body);
			res.end('OK');
		});
		
		this._expressServer.listen(port, ()=>{
			debug('express server listening');
		});
	}
	
	/**
	 * Set a regex that will test every text message received. If regex.test() returns true, callback is called with two arguments: the message received and reply callback.
	 * 
	 * @param {RegExp} regex RegExp for test message text
	 * @param {function} callback Callback to call if regex.test() return true
	 */
	onRegex (regex, callback) {
		if(regex && callback)
			this.regexCallbacks.push({regex, callback});
		else
			throw new Error('you must pass a regex and callback');
	}

	
	_processUpdateType (update) {
		debug('trying to process update and emit appropriate event');
		if(!update)
			return debug('update is undefined');

		_updateTypes.forEach(type=>{
			if(type in update) {
				debug(`emitting ${type} event`);
				this.emit(type, update[type]);
			}
		});
	}

	_processMessageType (message) {
		
		const reply_cbk = (text, optionals)=>{
			debug('replying message');
			optionals = optionals || {};
			optionals.reply_to_message_id = message.message_id;
			const to = message.chat.id;
			
			return this.sendMessage(to, text, optionals);
		};
		
		_messageTypes.forEach((msgType)=>{
			if(msgType in message) {
				debug(`emitting ${msgType} event`);
				this.emit(msgType, message, reply_cbk);
			}
		});
	}
	
	_checkRegexCallbacks (message) {
		
		const reply_cbk = (text, optionals)=>{
			debug('replying message');
			optionals = optionals || {};
			optionals.reply_to_message_id = message.message_id;
			const to = message.chat.id;
			
			return this.sendMessage(to, text, optionals);
		};
		
		this.regexCallbacks.some(v=>{
			if (v.regex.test(message.text)) {
				v.callback(message, reply_cbk);
				return this.onlyFirstRegexMatch;
			}
		});
	}
	
	_makeRequest (api_method, params) {
		if (!this.bot_token)
			throw new Error('Telegram Bot Token undefined');
			
		params = params || {};
		const uri = `https://api.telegram.org/bot${this.bot_token}/${api_method}`;
		const method = 'POST';
		// const formData = params;
		const json = true;
		
		if (params.json && params.json.text)
			params.json.text = emojify(params.json.text);
			
		if (params.formData && params.formData.caption)
			params.formData.caption = emojify(params.formData.caption);
			
		console.log('- params ', params);
		
		const requestOptions = {
			uri, method, /*formData,*/ json
		};
		
		Object.assign(requestOptions, params);
		
		return request(requestOptions);
	}
	
	/**
	 * Requires no parameters. Returns basic information about the bot in form of a `User` object.
	 * 
	 * @see {@link https://core.telegram.org/bots/api#getme}
	 * @returns	{Promise}
	 */
	getMe () {
		return this._makeRequest('getMe');
	}
	
	/**
	 * Send a simple text message.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {String} text Text to be sent.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {String} [optionals.parse_mode] Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
	 * @param {boolean} [optionals.disable_web_page_preview] Disables link previews for links in this message
	 * @param {boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message.
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * 
	 * @see {@link https://core.telegram.org/bots/api#sendmessage}
	 */
	sendMessage(chat_id, text, optionals) {
		// telegram message text can not be greater than 4096 characters
		if (text.length > this.max_msg_length) {
			
			// if configuration does not allow message split, throw an error
			if (!this.split_long_messages)
				return Promise.reject(new Error(`text can\'t be longer than ${this.max_msg_length} chars`));
			
			// Wraps text in chunks of 4096 characters
			const splited_text = this._split_text(text);
			
			// send sequentially
			return splited_text.reduce((previous, chunk)=>{
				// sendMessage call itself with a acceptable text length
				return previous
					.then(()=>this.sendMessage(chat_id, chunk, optionals));
			}, Promise.resolve());
		}

		// from here on executes only if text <= 4096
		const json = {};
		const params = {chat_id, text};
		
		Object.assign(json, params, optionals);
		
		const _sendmsg = ()=>{
			return this._makeRequest('sendMessage', {json});
		};
		
		return this.sendChatAction(chat_id, 'typing')
			.then(_sendmsg);
	}
	
	_split_text (text) {
	    const text_length = text.length;
	    const times_greater = Math.ceil((text_length / this.max_msg_length));
	    const splited_text = [];
	    
	    for (let i = 0; i < times_greater; i++) {
	        let start = this.max_msg_length * i;
	        let end = this.max_msg_length * (i + 1);
	        
	        let piece = text.substring(start, end);
	        
	        splited_text.push(piece);
	    }
	    
	    return splited_text;
	};
	
	/**
	 * Use this method to forward messages of any kind.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {Integer|String} from_chat_id Unique identifier for the chat where the original message was sent.
	 * @param {Integer} message_id Message identifier in the chat specified in from_chat_id
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#forwardmessage}
	 */
	forwardMessage (chat_id, from_chat_id, message_id, optionals) {
		const json = {};
		const params = {chat_id, from_chat_id, message_id};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('forwardMessage', {json});
	}
	
	/**
	 * Use this method to send photos.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {ReadStream|String} photo Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or pass read stream to upload your own file.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {String} [optionals.caption] Photo caption (may also be used when resending photos by file_id), 0-200 characters
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message.
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendphoto}
	 */
	sendPhoto (chat_id, photo, optionals={}) {
		const params = {chat_id, photo};
		const formData = {};
		Object.assign(formData, params, optionals);
		
		const _sendphoto = ()=>{
			return this._makeRequest('sendPhoto', {formData});
		};
		
		return this.sendChatAction(chat_id, 'upload_photo')
			.then(_sendphoto);
	}
	
	/**
	 * Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .mp3 format.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {ReadStream|String} audio Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or pass a read stream for upload your own.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {String} [optionals.caption] Audio caption, 0-200 characters
	 * @param {Integer} [optionals.duration] Duration of the audio in seconds.
	 * @param {String} [optionals.performer] Performer
	 * @param {String} [optionals.title] Track name
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message.
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendaudio}
	 */
	sendAudio (chat_id, audio, optionals) {
		const params = { chat_id, audio };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		const _sendaudio = ()=>{
			return this._makeRequest('sendAudio', {formData});
		};
		
		return this.sendChatAction(chat_id, 'upload_audio')
			.then(_sendaudio);
	}
	
	/**
	 * Use this method to send general files.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {ReadStream|String} document File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing an read stream for file.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {String} [optionals.caption] Document caption (may also be used when resending documents by file_id), 0-200 characters.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#senddocument}
	 */
	sendDocument (chat_id, doc, optionals) {
		const params = { chat_id: chat_id, document: doc };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		const _senddocument = ()=>{
			return this._makeRequest('sendDocument', {formData});
		};
		
		return this.sendChatAction(chat_id, 'upload_document')
			.then(_senddocument);
	}
	
	/**
	 * Use this method to send .webp stickers
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
	 * @param {ReadStream|String} sticker Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .webp file from the Internet, or upload a new one passing a Read Stream for file.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendsticker}
	 */
	sendSticker (chat_id, sticker, optionals) {
		const params = { chat_id, sticker };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendSticker', {formData});
	}
	
	/**
	 * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document).
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {ReadStream|String} video Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video passing a read stream.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Integer} [optionals.duration] Duration of sent video in seconds
	 * @param {Integer} [optionals.width] Video width
	 * @param {Integer} [optionals.height] Video height
	 * @param {String} [optionals.caption] Video caption (may also be used when resending videos by file_id), 0-200 characters
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendvideo}
	 */
	sendVideo (chat_id, video, optionals) {
		const params = { chat_id, video };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		const _sendvideo = ()=>{
			return this._makeRequest('sendVideo', {formData});
		};
		
		return this.sendChatAction(chat_id, 'upload_video')
			.then(_sendvideo);
	}
	
	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document).
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {ReadStream|String} voice Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one passing a read stream.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {String} [optionals.caption] Voice message caption, 0-200 characters
	 * @param {Integer} [optionals.duration] Duration of the voice message in seconds
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendvoice}
	 */
	sendVoice (chat_id, voice, optionals) {
		const params = { chat_id, voice };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendVoice', {formData});
	}
	
	/**
	 * Use this method to send point on the map.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {Float} latitude Latitude of location
	 * @param {FLoat} longitude Longitude of location
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendlocation}
	 */
	sendLocation (chat_id, latitude, longitude, optionals) {
		const params = { chat_id, latitude, longitude };
		const json = {};
		Object.assign(json, params);
		
		return this._makeRequest('sendLocation', {json});
	}
	
	/**
	 * Use this method to send information about a venue.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel.
	 * @param {Float} latitude Latitude of location
	 * @param {FLoat} longitude Longitude of location
	 * @param {String} title Name of the venue
	 * @param {String} address Address of the venue
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {String} [optionals.foursquare_id] Foursquare identifier of the venue
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendvenue}
	 */
	sendVenue (chat_id, latitude, longitude, title, address, optionals) {
		const params = { chat_id, latitude, longitude, title, address };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendVenue', {json});
	}
	
	/**
	 * Use this method to send phone contacts.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
	 * @param {String} phone_number Contact's phone number
	 * @param {String} first_name Contact's first name
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {String} [optionals.last_name] Contact's last name
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendcontact}
	 */
	sendContact (chat_id, phone_number, first_name, optionals) {
		const params = { chat_id, phone_number, first_name };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendContact', {json});
	}
	
	/**
	 * Attention: the sendMessage, sendPhoto, sendDocument, sendAudio and sendVideo methods automatically sends their repective chat actions before send data.
	 * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target channel
	 * @param {String} action Type of action to broadcast. Choose one, depending on what the user is about to receive: `typing` for text messages, `upload_photo` for photos, `record_video` or `upload_video` for videos, `record_audio` or `upload_audio` for audio files, `upload_document` for general files, `find_location` for location data.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendchataction}
	 */
	sendChatAction (chat_id, action) {
		const json = { chat_id, action };
		
		return this._makeRequest('sendChatAction', {json});
	}
	
	/**
	 * Use this method to get a list of profile pictures for a user.
	 * 
	 * @param {Integer|String} user_id Unique identifier of the target user
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Integer} [optionals.offset] Sequential number of the first photo to be returned. By default, all photos are returned.
	 * @param {Integer} [optionals.limit=100] Limits the number of photos to be retrieved. Values between 1—100 are accepted.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#getuserprofilephotos}
	 */
	getUserProfilePhotos (user_id, optionals) {
		const params = { user_id };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('getUserProfilePhotos', {json});
	}
	
	/**
	 * Use this method to get basic info about a file and prepare it for downloading. 
	 * The file can then be downloaded via the link 
	 * `https://api.telegram.org/file/bot<token>/<file_path>`,
	 * where `<file_path>` is taken from the response. 
	 * It is guaranteed that the link will be valid for at least 1 hour. 
	 * When the link expires, a new one can be requested by calling getFile again.
	 * 
	 * @param {Integer} file_id File identifier to get info about
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#getfile}
	 */
	getFile (file_id) {
		const json = { file_id };
		
		return this._makeRequest('getFile', {json});
	}
	
	/**
	 * Use this method to kick a user from a group or a supergroup.
	 * In the case of supergroups, the user will not be able to return to the
	 * group on their own using invite links, etc., unless unbanned first.
	 * 
	 * @param {Integer} chat_id Unique identifier for the target group or username of the target supergroup
	 * @param {Integer} user_id Unique identifier of the target user
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#kickchatmember}
	 */
	kickChatMember (chat_id, user_id) {
		const json = { chat_id, user_id };
		
		return this._makeRequest('kickChatMember', { json });
	}
	
	/**
	 * Use this method for your bot to leave a group, supergroup or channel.
	 * 
	 * @param {Integer|String} chat_id 	Unique identifier for the target chat or username of the target supergroup or channel
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#leavechat}
	 */
	leaveChat (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('leaveChat', { json });
	}
	
	/**
	 * Use this method to unban a previously kicked user in a supergroup.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target group or username of the target supergroup
	 * @param {Integer} user_id Unique identifier of the target user
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
	 */
	unbanChatMember (chat_id, user_id) {
		const json = { chat_id, user_id };
		
		return this._makeRequest('unbanChatMember', {json});
	}
	
	/**
	 * Use this method to get up to date information about the chat
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel 
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#unbanchatmember}
	 */
	getChat (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('getChat', { json });
	}

	/**
	 * Use this method to get a list of administrators in a chat. 
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel 
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#getchatadministrators}
	 */
	getChatAdministrators (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('getChatAdministrators', { json });
	}
	 /**
	  * Use this method to get the number of members in a chat.
	  * 
	  * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel 
	  * @returns {Promise}
	  * @see {@link https://core.telegram.org/bots/api#getchatmemberscount}
	  */
	getChatMembersCount (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('getChatMembersCount', { json });
	}
	
	/**
	 * Use this method to get information about a member of a chat.
	 * 
	 * @param {Integer|String} chat_id Unique identifier for the target chat or username of the target supergroup or channel 
	 * @param {Integer} user_id Unique identifier of the target user
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#getchatmember}
	 */
	getChatMember (chat_id, user_id) {
		const json = { chat_id, user_id };
		
		return this._makeRequest('getChatMember', { json });
	}
	
	/**
	 * Use this method to send answers to callback queries sent from inline keyboards.
	 * 
	 * @param {String} callback_query_id Unique identifier for the query to be answered
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {String} [optionals.text] Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
	 * @param {Boolean} [optionals.show_alert=false] If true, an alert will be shown by the client instead of a notification at the top of the chat screen.
	 * @param {String} [optionals.url] URL that will be opened by the user's client.
	 * @param {Integer} [optionals.cache_time=0] The maximum amount of time in seconds that the result of the callback query may be cached client-side.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#answercallbackquery}
	 */
	answerCallbackQuery (callback_query_id, optionals) {
		const params = { callback_query_id };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('answerCallbackQuery', { json });
	}
	
	/**
	 * Use this method to edit text and game messages sent by the bot or via the bot (for inline bots).
	 * 
	 * @param {String} text New text of the message
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Integer|String} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel
	 * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
	 * @param {String} [optionals.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message.
	 * @param {String} [optionals.parse_mode] Send Markdown or HTML.
	 * @param {Boolean} [optionals.disable_web_page_preview] Disables link previews for links in this message
	 * @param {Object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#editmessagetext}
	 */
	editMessageText (text, optionals) {
		const params = { text };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('editMessageText', { json });
	}
	
	/**
	 * Use this method to edit captions of messages sent by the bot or via the bot (for inline bots).
	 * 
	 * @param {Object} optionals An object with optional params that you want to send in request.
	 * @param {Integer|String} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel.
	 * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
	 * @param {String} [optionals.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
	 * @param {String} [optionals.caption] New caption of the message
	 * @param {String} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#editmessagecaption}
	 * 
	 */
	editMessageCaption (optionals) {
		const json = optionals;
		
		return this._makeRequest('editMessageCaption', { json });
	}
	
	/**
	 * Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots)
	 * 
	 * @param {Object} optionals An object with optional params that you want to send in request.
	 * @param {Integer|String} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat or username of the target channel
	 * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
	 * @param {String} [optioanls.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
	 * @param {Object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#editmessagereplymarkup}
	 */
	editMessageReplyMarkup (optionals) {
		const json = optionals;
		
		return this._makeRequest('editMessageReplyMarkup', { json });
	}
	
	/**
	 * Use this method to send answers to an inline query.
	 * No more than 50 results per query are allowed.
	 * 
	 * @param {String} inline_query_id Unique identifier for the answered query
	 * @param {Array} results A JSON-serialized array of [results](https://core.telegram.org/bots/api#inlinequeryresult) for the inline query
	 * @param {Object} optionals An object with optional params that you want to send in request.
	 * @param {Integer} [optionals.cache_time=300] The maximum amount of time in seconds that the result of the inline query may be cached on the server.
	 * @param {Boolean} [optionals.is_personal] Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
	 * @param {String} [optionals.next_offset] Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination.
	 * @param {String} [optionals.switch_pm_text] If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
	 * @param {String} [optionals.switch_pm_parameter] Parameter for the start message sent to the bot when user presses the switch button
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#answerinlinequery}
	 */
	answerInlineQuery (inline_query_id, results, optionals) {
		const params = { inline_query_id, results };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('answerInlineQuery', { json });
	}
	
	/**
	 * Use this method to send a game.
	 * 
	 * @param {Integer} chat_id Unique identifier for the target chat
	 * @param {String} game_short_name Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather.
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.disable_notification] Sends the message silently.
	 * @param {Integer} [optionals.reply_to_message_id] If the message is a reply, ID of the original message
	 * @param {Object} [optionals.reply_markup] A JSON-serialized object for an inline keyboard. 
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#sendgame}
	 */
	sendGame (chat_id, game_short_name, optionals) {
		const params = { chat_id, game_short_name };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendGame', { json });
	}
	
	/**
	 * Use this method to set the score of the specified user in a game.
	 * 
	 * @param {Integer} user_id User identifier
	 * @param {Integer} score New score, must be non-negative
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Boolean} [optionals.force] Pass True, if the high score is allowed to decrease.
	 * @param {Boolean} [optionals.disable_edit_message] Pass True, if the game message should not be automatically edited to include the current scoreboard
	 * @param {Integer} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat
	 * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
	 * @param {String} [optionals.inline_message_id] Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#setgamescore}
	 */
	setGameScore (user_id, score, optionals) {
		const params = { user_id, score };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('setGameScore', {  json });
	} 
	
	/**
	 * Use this method to get data for high score tables.
	 * 
	 * @param {Integer} user_id Target user id
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Integer} [optionals.chat_id] Required if `inline_message_id` is not specified. Unique identifier for the target chat
	 * @param {Integer} [optionals.message_id] Required if `inline_message_id` is not specified. Identifier of the sent message
	 * @param {String} [optionals.inline_message_id] Required if chat_id and message_id are not specified. Identifier of the inline message
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#getgamehighscores}
	 */
	getGameHighScores (user_id, optionals) {
		const params = { user_id };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('getGameHighScores', { json });
	}
	
	/**
	 * Use this method to receive incoming updates using long polling.
	 * 
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {Integer} [optionals.offset] Identifier of the first update to be returned.
	 * @param {Integer} [optionals.limit=100] Limits the number of updates to be retrieved. Values between 1—100 are accepted.
	 * @param {Integer} [optionals.timeout] Timeout in seconds for long polling.
	 * @param {Array} [optionals.allowed_updates] List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#getupdates}
	 */
	getUpdates (optionals) {
		const json = optionals || {};
		
		return this._makeRequest('getUpdates', { json });
	}
	
	/**
	 * Use this method to specify a url and receive incoming updates via an outgoing webhook.
	 * 
	 * @param {String} url HTTPS url to send updates to. Use an empty string to remove webhook integration
	 * @param {Object} [optionals] An object with optional params that you want to send in request.
	 * @param {ReadStrem} [optionals.certificate] Upload your public key certificate so that the root certificate in use can be checked.
	 * @param {Integer} [optionals.max_connections=40] Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100.
	 * @param {Array} [optionals.allowed_updates] List the types of updates you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#setwebhook}
	 */
	setWebhook (url, optionals) {
		const params = { url };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('setWebhook', { formData });
	}
	
	/**
	 * Use this method to remove webhook integration if you decide to switch back to getUpdates. Requires no parameters.
	 * 
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#deletewebhook}
	 */
	deleteWebhook () {
		return this._makeRequest('deleteWebhook');
	}
	
	/**
	 * Use this method to get current webhook status. Requires no parameters.
	 * 
	 * @returns {Promise}
	 * @see {@link https://core.telegram.org/bots/api#deletewebhook}
	 */
	getWebhookInfo () {
		return this._makeRequest('getWebhookInfo');
	}
}

module.exports = TelegramBotClient;