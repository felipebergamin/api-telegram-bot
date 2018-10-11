/* tslint:disable:max-line-length */
import EventEmitter = require("events");
import { IncomingMessage, ServerResponse } from "http";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Message } from "./interfaces/Message";
import { MessageActions } from "./interfaces/MessageActions";
import { RegexCallback } from "./interfaces/RegexCallback";
import { Update } from "./interfaces/Update";
import { createMessageActions } from "./utils";

const _messageTypes = [
  "text", "audio", "document", "game", "photo", "sticker", "video", "voice", "video_note",
  "contact", "location", "venue", "new_chat_members", "left_chat_member", "new_chat_title",
  "new_chat_photo", "delete_chat_photo", "group_chat_created", "supergroup_chat_created",
  "channel_chat_created", "pinned_message", "invoice", "successful_payment",
];
const _updateTypes = [
  "message", "edited_message", "channel_post", "edited_channel_post",
  "inline_query", "chosen_inline_result", "callback_query", "shipping_query",
  "pre_checkout_query",
];

export class Webhook extends EventEmitter {
  private bot: Bot;
  private onlyFirstRegexMatch: boolean;
  private regexCallbacks: RegexCallback[];

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot TelegramBotClient instance
   * @param onlyFirstRegexMatch `true` for execute only first callback whose RegExp returns true. `false` will execute all matches. (see .onRegex())
   */
  constructor(bot: Bot, onlyFirstRegexMatch: boolean = true) {
    super();

    bot.webhook = this;
    this.bot = bot;
    this.onlyFirstRegexMatch = onlyFirstRegexMatch;
    this.regexCallbacks = [];

    this.on("message", this.processMessageType);
    this.on("message", this.checkRegexCallbacks);
  }

  /**
   * Set a regex that will test every text message received. If regex.test() returns true, callback is called with two arguments: the message received and reply callback.
   * @param {RegExp} regex RegExp for test message text
   * @param {function} callback Callback to call if regex.test() return true
   */
  public onRegex(regex: RegExp, callback: (message: any, actions: MessageActions) => void): void {
    if (regex && callback) {
      this.regexCallbacks.push({regex, callback});
    } else {
      throw new Error("you must pass a regex and callback");
    }
  }

  /**
   * Use this method to create a route manipulator function for webhook.
   * @returns {function}
   * @example
   * // using node http
   * http.createServer(bot.getWebhook())
   * 	.listen(3000);
   * // using express
   * app.post(webhookUrl, bot.getWebhook())
   */
  public getWebhook() {
    return (req: IncomingMessage, res: ServerResponse) => {
      if (req.method === "POST") {
        const chunks: any[] = [];
        let body: string;
        let receivedData: any;

        req.on("error", (err) => {
          res.statusCode = 500;
          this.emit("error", err);
          res.end();
        })
        .on("data", (chunk) => {
          chunks.push(chunk);
        })
        .on("end", () => {
          try {
            body = Buffer.concat(chunks).toString();
            receivedData = JSON.parse(body);
            res.statusCode = 200;
            res.end();
          } catch (err) {
            this.emit("error", err);
            res.statusCode = 400;
            res.end();
          }

          debug("webhook: POST received on Webhook:");
          debug(body);

          this.processUpdateType(receivedData);
        });
      } else {
        debug(`webhook: ${req.method} received, but expecting POST`);
        res.statusCode = 404;
        res.end();
      }
    };
  }

  private processUpdateType(update: Update) {
    debug("trying to process update and emit appropriate event");
    if (!update) {
      return debug("update is undefined");
    }

    _updateTypes.forEach((type: string) => {
      if (type in update) {
        debug(`emitting ${type} event`);
        this.emit(type, update[type]);
      }
    });
  }

  private processMessageType(message: Message) {
    const actions = createMessageActions(message, this.bot);

    _messageTypes.forEach((msgType) => {
      if (msgType in message) {
        debug(`emitting ${msgType} event`);
        this.emit(msgType, message, actions);
      }
    });
  }

  private checkRegexCallbacks(message: Message) {
    const actions = createMessageActions(message, this.bot);

    this.regexCallbacks.some((v: RegexCallback): boolean => {
      if (v.regex.test(message.text)) {
        v.callback(message, actions);
        return this.onlyFirstRegexMatch;
      }
      return false;
    });
  }
}
