'use strict';

const express = require('express');
const bodyparser = require('body-parser');
const EventEmitter = require('events');
const TelegramBotClient = require('telegram-bot-client');
const debug = require('debug')('api-telegram-bot');

const _messageTypes = [
	'text', 'audio', 'document', 'photo', 'sticker', 'video', 'voice', 'contact',
	'location', 'new_chat_participant', 'left_chat_participant', 'new_chat_title',
	'new_chat_photo', 'delete_chat_photo', 'group_chat_created'
];

class TelegramWebHook extends EventEmitter {

	/**
	 * Construtor do WebHook, pooling não é suportado, apenas WebHook.
	 *
	 * @class TelegramWebHook
	 * @constructor
	 * @param {Object} [options]
	 * @param {String} [options.token] Bot Token
	 * @param {Object} [options.expressApp=express()] Objeto express personalizado
	 * @param {Object} [options.webhook] Opções do WebHook
	 * @param {Number} [options.webhook.port=80] Porta para o servidor http escutar
	 * @param {String} [options.webhook.path='/'] Path do WebHook
	 */
	constructor(options) {
		super();

		if (typeof options === 'object') {
			debug('constructing TelegramWebHook');
			
			this.bot = new TelegramBotClient(options.token);
			this.webhook = {};
			this.webhook.port = options.webhook.port || 80;
			this.webhook.path = options.webhook.path || '/';

			this.setupWebHook(options.expressApp)
			this.startWebHook();

			this.on('message', this.processMessageType);
		} else {
			throw new Error('options must be an object');
		}
	};

	processUpdateType (update) {
		debug('trying to process update and emit appropriate event');
		if(!update)
			return debug('update is undefined');

		if(update.message) {
			const callback_reply = (text, options)=>{
				options = options || {};
				options.reply_to_message_id = update.message.message_id;

				return this.bot.sendMessage(update.message.chat.id, text, options);
			};

			this.emit('message', update.message, callback_reply);
			debug('Emitting message event');
		}
		else if(update.edited_message) {
			this.emit('edited_message', update.edited_message);
			debug('Emitting edited_message event');
		}
		else if(update.channel_post) {
			this.emit('channel_post', update.channel_post);
			debug('Emitting channel_post event');
		}
		else if(update.edited_channel_post) {
			this.emit('edited_channel_post', update.edited_channel_post);
			debug('Emitting edited_channel_post event');
		}
		else if(update.inline_query) {
			this.emit('inline_query', update.inline_query);
			debug('Emitting inline_query event');
		}
		else if(update.chosen_inline_result) {
			this.emit('chosen_inline_result', update.chosen_inline_result);
			debug('Emitting chosen_inline_result event');
		}
		else if(update.callback_query) {
			this.emit('callback_query', update.callback_query);
			debug('Emitting callback_query event');
		}
	}

	processMessageType (message, reply_cbk) {
		
		_messageTypes.forEach((msgType)=>{
			if(message[msgType]) {
				debug(`emitting ${msgType} event`);
				this.emit(msgType, message, reply_cbk);
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
}

module.exports = TelegramWebHook;