/* tslint:disable:max-line-length */
import EventEmitter = require("events");
import { IncomingMessage, ServerResponse } from "http";
import { debug } from "./debug";
import { IMessage as Message } from "./interfaces/IMessage";
import { IMessageActions as MessageActions } from "./interfaces/IMessageActions";
import { IRegexCallback as RegexCallback } from "./interfaces/IRegexCallback";
import { ITelegramResponse as TelegramResponse } from "./interfaces/ITelegramResponse";
import { IUpdate as Update } from "./interfaces/IUpdate";
import { ISendMessageOptionals } from "./interfaces/OptionalParams/ISendMessage";
import { TelegramBotClient } from "./TelegramBotClient";

const _messageTypes = [
  "text", "audio", "document", "photo", "sticker", "video", "voice", "contact",
  "location", "new_chat_participant", "left_chat_participant", "new_chat_title",
  "new_chat_photo", "delete_chat_photo", "group_chat_created",
];
const _updateTypes = [
  "message", "edited_message", "channel_post", "edited_channel_post",
  "inline_query", "chosen_inline_result", "callback_query", "shipping_query",
  "pre_checkout_query",
];

export class Webhook extends EventEmitter {
  private onlyFirstRegexMatch: boolean;
  private regexCallbacks: RegexCallback[];
  private bot: TelegramBotClient;

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot TelegramBotClient instance
   * @param onlyFirstRegexMatch `true` for execute only first callback whose RegExp returns true. `false` will execute all matches. (see .onRegex())
   */
  constructor(bot: TelegramBotClient, onlyFirstRegexMatch: boolean = true) {
    super();

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
   * Attention: the webhook url must contains the bot token.
   * @returns {function}
   * @example
   * // using node http
   * http.createServer(bot.getWebhook())
   * 	.listen(3000);
   * // using express
   * app.post(webhookUrl, bot.getWebhook())
   */
  public getWebhook() {
    const wh = (req: IncomingMessage, res: ServerResponse) => {
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

    return wh;
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

  private getActionsFor(message: Message): MessageActions {

    const banChatMember = (until: number = 0): Promise<TelegramResponse<boolean>> => {
      debug("ban member");

      return this.bot.kickChatMember(message.chat.id, message.from.id, until);
    };

    const deleteMessage = (): Promise<TelegramResponse<boolean>> => {
      debug("deleting message");

      return this.bot.deleteMessage(message.chat.id, message.message_id);
    };

    const reply = (text: string, optionals?: ISendMessageOptionals): Promise<TelegramResponse<Message>> => {
      debug("replying message");

      optionals = optionals || {} as ISendMessageOptionals;
      optionals.reply_to_message_id = message.message_id;

      return this.bot.sendMessage(message.chat.id, text);
    };

    if (message.chat.type.includes("private")) {
      return {
        reply,
      } as MessageActions;
    }

    return {
      banChatMember,
      deleteMessage,
      reply,
    } as MessageActions;
  }

  private processMessageType(message: Message) {
    const actions = this.getActionsFor(message);

    _messageTypes.forEach((msgType) => {
      if (msgType in message) {
        debug(`emitting ${msgType} event`);
        this.emit(msgType, message, actions);
      }
    });
  }

  private checkRegexCallbacks(message: Message) {
    const actions = this.getActionsFor(message);

    this.regexCallbacks.some((v: RegexCallback): boolean => {
      if (v.regex.test(message.text)) {
        v.callback(message, actions);
        return this.onlyFirstRegexMatch;
      }
      return false;
    });
  }
}
