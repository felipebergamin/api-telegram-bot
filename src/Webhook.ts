/* tslint:disable:max-line-length */
import EventEmitter = require("events");
import { IncomingMessage, ServerResponse } from "http";
import { fromEvent, Observable } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Update, WrappedMessageActions } from "./interfaces";
import {
  checkUpdateType,
  createFilteredMessageObservable,
  createFilteredUpdateObservable,
  createMessageActions,
  ExplicitTypedUpdate,
} from "./utils";

export class Webhook {
  public message: Observable<WrappedMessageActions>;
  public editedMessage: Observable<Update>;
  public channelPost: Observable<Update>;
  public editedChannelPost: Observable<Update>;
  public inlineQuery: Observable<Update>;
  public chosenInlineResult: Observable<Update>;
  public callbackQuery: Observable<Update>;
  public shippingQuery: Observable<Update>;
  public preCheckoutQuery: Observable<Update>;

  public text: Observable<WrappedMessageActions>;
  public audio: Observable<WrappedMessageActions>;
  public document: Observable<WrappedMessageActions>;
  public game: Observable<WrappedMessageActions>;
  public photo: Observable<WrappedMessageActions>;
  public sticker: Observable<WrappedMessageActions>;
  public video: Observable<WrappedMessageActions>;
  public voice: Observable<WrappedMessageActions>;
  public videoNote: Observable<WrappedMessageActions>;
  public contact: Observable<WrappedMessageActions>;
  public location: Observable<WrappedMessageActions>;
  public venue: Observable<WrappedMessageActions>;
  public newChatMembers: Observable<WrappedMessageActions>;
  public leftChatMember: Observable<WrappedMessageActions>;
  public newChatTitle: Observable<WrappedMessageActions>;
  public newChatPhoto: Observable<WrappedMessageActions>;
  public deleteChatPhoto: Observable<WrappedMessageActions>;
  public groupChatCreated: Observable<WrappedMessageActions>;
  public supergroupChatCreated: Observable<WrappedMessageActions>;
  public channelChatCreated: Observable<WrappedMessageActions>;
  public pinnedMessage: Observable<WrappedMessageActions>;
  public invoice: Observable<WrappedMessageActions>;
  public successfulPayment: Observable<WrappedMessageActions>;

  private _events = new EventEmitter();
  private observable: Observable<Update>;

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot TelegramBotClient instance
   */
  constructor(private bot: Bot) {
    this.observable = this._createObservable().pipe(share());

    this.message = createFilteredUpdateObservable(this.updates, "message")
      .pipe(map((update) => ({ update, actions: createMessageActions(update.message, this.bot) })));
    this.editedMessage = createFilteredUpdateObservable(this.updates, "edited_message");
    this.channelPost = createFilteredUpdateObservable(this.updates, "channel_post");
    this.editedChannelPost = createFilteredUpdateObservable(this.updates, "edited_channel_post");
    this.inlineQuery = createFilteredUpdateObservable(this.updates, "inline_query");
    this.chosenInlineResult = createFilteredUpdateObservable(this.updates, "chosen_inline_result");
    this.callbackQuery = createFilteredUpdateObservable(this.updates, "callback_query");
    this.shippingQuery = createFilteredUpdateObservable(this.updates, "shipping_query");
    this.preCheckoutQuery = createFilteredUpdateObservable(this.updates, "pre_checkout_query");

    this.text = createFilteredMessageObservable(this.message, "text");
    this.audio = createFilteredMessageObservable(this.message, "audio");
    this.document = createFilteredMessageObservable(this.message, "document");
    this.game = createFilteredMessageObservable(this.message, "game");
    this.photo = createFilteredMessageObservable(this.message, "photo");
    this.sticker = createFilteredMessageObservable(this.message, "sticker");
    this.video = createFilteredMessageObservable(this.message, "video");
    this.voice = createFilteredMessageObservable(this.message, "voice");
    this.videoNote = createFilteredMessageObservable(this.message, "video_note");
    this.contact = createFilteredMessageObservable(this.message, "contact");
    this.location = createFilteredMessageObservable(this.message, "location");
    this.venue = createFilteredMessageObservable(this.message, "venue");
    this.newChatMembers = createFilteredMessageObservable(this.message, "new_chat_members");
    this.leftChatMember = createFilteredMessageObservable(this.message, "left_chat_member");
    this.newChatTitle = createFilteredMessageObservable(this.message, "new_chat_title");
    this.newChatPhoto = createFilteredMessageObservable(this.message, "new_chat_photo");
    this.deleteChatPhoto = createFilteredMessageObservable(this.message, "delete_chat_photo");
    this.groupChatCreated = createFilteredMessageObservable(this.message, "group_chat_created");
    this.supergroupChatCreated = createFilteredMessageObservable(this.message, "supergroup_chat_created");
    this.channelChatCreated = createFilteredMessageObservable(this.message, "channel_chat_created");
    this.pinnedMessage = createFilteredMessageObservable(this.message, "pinned_message");
    this.invoice = createFilteredMessageObservable(this.message, "invoice");
    this.successfulPayment = createFilteredMessageObservable(this.message, "successful_payment");

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
