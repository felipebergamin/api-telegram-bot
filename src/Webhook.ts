/* tslint:disable:max-line-length */
import EventEmitter = require("events");
import { IncomingMessage, ServerResponse } from "http";
import { fromEvent, Observable } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Message } from "./interfaces";
import { MessageActions } from "./interfaces/MessageActions";
import { RegexCallback } from "./interfaces/RegexCallback";
import { Update } from "./interfaces/Update";
import {
  checkUpdateType,
  createFilteredMessageObservable,
  createFilteredUpdateObservable,
  ExplicitTypedUpdate,
} from "./utils";

export class Webhook {
  public messages: Observable<Update>;
  public editedMessages: Observable<Update>;
  public channelPost: Observable<Update>;
  public editedChannelPost: Observable<Update>;
  public inlineQuery: Observable<Update>;
  public chosenInlineResult: Observable<Update>;
  public callbackQuery: Observable<Update>;
  public shippingQuery: Observable<Update>;
  public preCheckoutQuery: Observable<Update>;

  public text: Observable<Update>;
  public audio: Observable<Update>;
  public document: Observable<Update>;
  public game: Observable<Update>;
  public photo: Observable<Update>;
  public sticker: Observable<Update>;
  public video: Observable<Update>;
  public voice: Observable<Update>;
  public videoNote: Observable<Update>;
  public contact: Observable<Update>;
  public location: Observable<Update>;
  public venue: Observable<Update>;
  public newChatMembers: Observable<Update>;
  public leftChatMember: Observable<Update>;
  public newChatTitle: Observable<Update>;
  public newChatPhoto: Observable<Update>;
  public deleteChatPhoto: Observable<Update>;
  public groupChatCreated: Observable<Update>;
  public supergroupChatCreated: Observable<Update>;
  public channelChatCreated: Observable<Update>;
  public pinnedMessage: Observable<Update>;
  public invoice: Observable<Update>;
  public successfulPayment: Observable<Update>;

  private _events = new EventEmitter();
  private observable: Observable<Update>;

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot TelegramBotClient instance
   */
  constructor(bot: Bot) {
    this.observable = this._createObservable().pipe(share());

    this.messages = createFilteredUpdateObservable(this.updates, "message");
    this.editedMessages = createFilteredUpdateObservable(this.updates, "edited_message");
    this.channelPost = createFilteredUpdateObservable(this.updates, "channel_post");
    this.editedChannelPost = createFilteredUpdateObservable(this.updates, "edited_channel_post");
    this.inlineQuery = createFilteredUpdateObservable(this.updates, "inline_query");
    this.chosenInlineResult = createFilteredUpdateObservable(this.updates, "chosen_inline_result");
    this.callbackQuery = createFilteredUpdateObservable(this.updates, "callback_query");
    this.shippingQuery = createFilteredUpdateObservable(this.updates, "shipping_query");
    this.preCheckoutQuery = createFilteredUpdateObservable(this.updates, "pre_checkout_query");

    this.text = createFilteredMessageObservable(this.messages, "text");
    this.audio = createFilteredMessageObservable(this.messages, "audio");
    this.document = createFilteredMessageObservable(this.messages, "document");
    this.game = createFilteredMessageObservable(this.messages, "game");
    this.photo = createFilteredMessageObservable(this.messages, "photo");
    this.sticker = createFilteredMessageObservable(this.messages, "sticker");
    this.video = createFilteredMessageObservable(this.messages, "video");
    this.voice = createFilteredMessageObservable(this.messages, "voice");
    this.videoNote = createFilteredMessageObservable(this.messages, "video_note");
    this.contact = createFilteredMessageObservable(this.messages, "contact");
    this.location = createFilteredMessageObservable(this.messages, "location");
    this.venue = createFilteredMessageObservable(this.messages, "venue");
    this.newChatMembers = createFilteredMessageObservable(this.messages, "new_chat_members");
    this.leftChatMember = createFilteredMessageObservable(this.messages, "left_chat_member");
    this.newChatTitle = createFilteredMessageObservable(this.messages, "new_chat_title");
    this.newChatPhoto = createFilteredMessageObservable(this.messages, "new_chat_photo");
    this.deleteChatPhoto = createFilteredMessageObservable(this.messages, "delete_chat_photo");
    this.groupChatCreated = createFilteredMessageObservable(this.messages, "group_chat_created");
    this.supergroupChatCreated = createFilteredMessageObservable(this.messages, "supergroup_chat_created");
    this.channelChatCreated = createFilteredMessageObservable(this.messages, "channel_chat_created");
    this.pinnedMessage = createFilteredMessageObservable(this.messages, "pinned_message");
    this.invoice = createFilteredMessageObservable(this.messages, "invoice");
    this.successfulPayment = createFilteredMessageObservable(this.messages, "successful_payment");

    bot.webhook = this;
  }

  public get updates(): Observable<ExplicitTypedUpdate> {
    return this.observable
      .pipe(map((update) => checkUpdateType(update)));
  }

  /**
   * Use this method to create a route manipulator function for webhook.
   */
  public getWebhook(): (req: IncomingMessage, res: ServerResponse) => void {
    return (req: IncomingMessage, res: ServerResponse) => {
      if (req.method === "POST") {
        const chunks: any[] = [];
        let body: string;
        let receivedData: any;

        req.on("error", (err) => {
          res.statusCode = 500;
          this._events.emit("error", err);
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
              this._events.emit("error", err);
              res.statusCode = 400;
              res.end();
            }

            debug("webhook: POST received on Webhook:");
            debug(body);

            this._events.emit("update", receivedData);
          });
      } else {
        debug(`webhook: ${req.method} received, but expecting POST`);
        res.statusCode = 404;
        res.end();
      }
    };
  }

  private _createObservable(): Observable<Update> {
    return fromEvent(this._events, "update");
  }
}
