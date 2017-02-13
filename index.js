'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const EventEmitter = require('events');
const debug = require('debug')('api-telegram-bot');
const request = require('request-promise');

const _messageTypes = [
	'text', 'audio', 'document', 'photo', 'sticker', 'video', 'voice', 'contact',
	'location', 'new_chat_participant', 'left_chat_participant', 'new_chat_title',
	'new_chat_photo', 'delete_chat_photo', 'group_chat_created'
];
const _updateTypes = [
	'message', 'edited_message', 'channel_post', 'edited_channel_post',
	'inline_query', 'chosen_inline_result', 'callback_query'
];

class TelegramWebHook extends EventEmitter {

	/**
	 * Construtor do WebHook, pooling não é suportado, apenas WebHook.
	 *
	 * @class TelegramWebHook
	 * @constructor
	 * @param {Object} [options]
	 * @param {String} [options.token] Bot Token
	 * @param {Boolean}	[options.onlyFirstMatch=false] Se true, apenas a primeira regex válida definida em onText() será executada. Se false, todas as válidas serão executadas.
	 * @param {Object} [options.expressApp=express()] Objeto express personalizado
	 * @param {Object} [options.webhook] Opções do WebHook
	 * @param {Number} [options.webhook.port=80] Porta para o servidor http escutar
	 * @param {String} [options.webhook.path='/'] Path do WebHook
	 */
	constructor(options) {
		super();

		if (typeof options === 'object') {
			debug('constructing TelegramWebHook');
			
			this.bot_token = options.token;
			this.webhook = {};
			this.webhook.port = options.webhook.port || 80;
			this.webhook.path = options.webhook.path || '/';

			this.setupWebHook(options.expressApp)
			this.startWebHook();
			
			this.regexCallbacks = [];
			this.onlyFirstMatch = options.onlyFirstMatch || false;

			this.on('message', this.processMessageType);
			this.on('message', this._checkRegexCallbacks);
		} else {
			throw new Error('options must be an object');
		}
	};
	
	/**
	 * Define uma regex e uma callback que será executada quando uma mensagem cujo texto retornar true para regex.test()
	 * 
	 * @param {RegExp} [regex] Regex que testará a mensagem recebida.
	 * @param {function} callback será chamada com dois parâmetros. O primeiro é a mensagem recebida, o segundo, é uma função `reply`.
	 */
	onRegex (regex, callback) {
		if(regex && callback)
			this.regexCallbacks.push({regex, callback});
		else
			throw new Error('you must pass a regex and callback');
	}

	processUpdateType (update) {
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

	processMessageType (message) {
		
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
				return this.onlyFirstMatch;
			}
		});
	}

	setupWebHook (webhook) {
		debug('Setting webhook conf');
		webhook = webhook || express();
		this.expressServer = webhook;

		// parse application/json
		webhook.use(bodyparser.json())

		webhook.post(this.webhook.path, (req, res)=>{
			debug('Post received');
			debug(JSON.stringify(req.body, null, 4));
			this.processUpdateType(req.body);
			res.end('OK');
		});
	}

	startWebHook () {
		const port = this.webhook.port || 80;
		this.expressServer.listen(port, ()=>{
			debug(`express listening on port ${port} path ${this.webhook.path}`);
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
		
		const requestOptions = {
			uri, method, /*formData,*/ json
		};
		
		Object.assign(requestOptions, params);
		
		return request(requestOptions);
	}
	
	getMe () {
		return this.makeRequest('getMe');
	}
	
	sendMessage(chat_id, text, optionals) {
		const json = {};
		const params = {chat_id, text};
		
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendMessage', {json});
	}
	
	forwardMessage (chat_id, from_chat_id, message_id, optionals) {
		const json = {};
		const params = {chat_id, from_chat_id, message_id};
		Object.assign(json, params, optionals);
		
		return this.makeRequest('forwardMessage', {json});
	}
	
	sendPhoto (chat_id, photo, optionals) {
		const params = {chat_id, photo}
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendPhoto', {formData});
	}
	
	sendAudio (chat_id, audio, optionals) {
		const params = { chat_id, audio };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendAudio', {formData});
	}
	
	sendDocument (chat_id, doc, optionals) {
		const params = { chat_id: chat_id, document: doc };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendDocument', {formData})
	}
	
	sendSticker (chat_id, sticker, optionals) {
		const params = { chat_id, sticker };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendSticker', {formData});
	}
	
	sendVideo (chat_id, video, optionals) {
		const params = { chat_id, video };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendVideo', {formData});
	}
	
	sendVoice (chat_id, voice, optionals) {
		const params = { chat_id, voice };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('sendVoice', {formData});
	}
	
	sendLocation (chat_id, latitude, longitude, optionals) {
		const params = { chat_id, latitude, longitude };
		const json = {};
		Object.assign(json, params);
		
		return this._makeRequest('sendLocation', {json});
	}
	
	sendVenue (chat_id, latitude, longitude, title, address, optionals) {
		const params = { chat_id, latitude, longitude, title, address };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendVenue', {json});
	}
	
	sendContact (chat_id, phone_number, first_name, optionals) {
		const params = { chat_id, phone_number, first_name };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendContact', {json});
	}
	
	sendChatAction (chat_id, action) {
		const json = { chat_id, action };
		
		return this._makeRequest('sendChatAction', {json});
	}
	
	getUserProfilePhotos (user_id, optionals) {
		const params = { user_id };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('getUserProfilePhotos', {json});
	}
	
	getFile (file_id) {
		const json = { file_id };
		
		return this._makeRequest('getFile', {json});
	}
	
	kickChatMember (chat_id, user_id) {
		const json = { chat_id, user_id };
		
		return this._makeRequest('kickChatMember', { json });
	}
	
	leaveChat (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('leaveChat', { json });
	}
	
	unbanChatMember (chat_id, user_id) {
		const json = { chat_id, user_id };
		
		return this._makeRequest('unbanChatMember', {json});
	}
	
	getChat (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('getChat', { json });
	}
	
	getChatAdministrators (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('getChatAdministrators', { json });
	}
	
	getChatMembersCount (chat_id) {
		const json = { chat_id };
		
		return this._makeRequest('getChatMembersCount', { json });
	}
	
	getChatMember (chat_id, user_id) {
		const json = { chat_id, user_id };
		
		return this._makeRequest('getChatMember', { json });
	}
	
	answerCallbackQuery (callback_query_id, optionals) {
		const params = { callback_query_id };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('answerCallbackQuery', { json });
	}
	
	editMessageText (text, optionals) {
		const params = { text };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('editMessageText', { json });
	}
	
	editMessageCaption (optionals) {
		const json = optionals;
		
		return this._makeRequest('editMessageCaption', { json });
	}
	
	editMessageReplyMarkup (optionals) {
		const json = optionals;
		
		return this._makeRequest('editMessageReplyMarkup', { json });
	}
	
	answerInlineQuery (inline_query_id, results, optionals) {
		const params = { inline_query_id, results };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('answerInlineQuery', { json });
	}
	
	sendGame (chat_id, game_short_name, optionals) {
		const params = { chat_id, game_short_name };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('sendGame', { json });
	}
	
	setGameScore (user_id, score, optionals) {
		const params = { user_id, score };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('setGameScore', {  json });
	} 
	
	getGameHighScores (user_id, optionals) {
		const params = { user_id };
		const json = {};
		Object.assign(json, params, optionals);
		
		return this._makeRequest('getGameHighScores', { json });
	}
	
	getUpdates (optionals) {
		const json = optionals || {};
		
		return this._makeRequest('getUpdates', { json });
	}
	
	setWebhook (url, optionals) {
		const params = { url };
		const formData = {};
		Object.assign(formData, params, optionals);
		
		return this._makeRequest('setWebhook', { formData });
	}
	
	deleteWebhook () {
		return this._makeRequest('deleteWebhook');
	}
	
	getWebhookInfo () {
		return this._makeRequest('getWebhookInfo');
	}
}

module.exports = TelegramWebHook;