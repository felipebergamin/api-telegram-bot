import { Observable, Observer } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Update } from "./interfaces";
import {
  checkUpdateType,
  createFilteredMessageObservable,
  createFilteredUpdateObservable,
  ExplicitTypedUpdate,
} from "./utils";

export class Polling {
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

  private offset;
  private limit;
  private allowed_updates;
  private timeout;
  private receivedStopSignal;
  private observable: Observable<Update>;

  constructor(private bot: Bot, { limit = 100, offset = 0, allowed_updates = [], timeout = 10 } = {}) {
    this.offset = offset;
    this.limit = limit;
    this.allowed_updates = allowed_updates;
    this.timeout = timeout;
    this.receivedStopSignal = false;

    this.observable = this.createObservable().pipe(share());

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
  }

  public get updates(): Observable<ExplicitTypedUpdate> {
    return this.observable
      .pipe(map((update) => checkUpdateType(update)));
  }

  public stopPolling() {
    this.receivedStopSignal = true;
  }

  private createObservable(): Observable<Update> {
    return Observable.create((observer: Observer<Update>) => {
      debug("Creating Observable");
      const getUpdates = () => {
        debug("Getting updates: %j", {
          allowed_updates: this.allowed_updates,
          limit: this.limit,
          offset: this.offset,
          timeout: this.timeout,
        });

        return this.bot.getUpdates({
          allowed_updates: this.allowed_updates,
          limit: this.limit,
          offset: this.offset,
          timeout: this.timeout,
        }).then((updates) => {
          debug(`received ${updates.result.length} updates`);
          if (updates.ok && updates.result.length > 0) {
            this.offset = updates.result[updates.result.length - 1].update_id + 1;
            for (const u of updates.result) {
              observer.next(u);
            }
          }

          if (!this.receivedStopSignal) {
            return getUpdates();
          }
          debug(`Stop flag is ${this.receivedStopSignal}, stopping polling`);
          observer.complete();
          return updates;
        }).catch((err) => {
          debug("error on fetch updates");
          observer.error(err);
          if (!this.receivedStopSignal) {
            return getUpdates();
          }
          observer.complete();
        });
      };

      getUpdates();
    });
  }
}
