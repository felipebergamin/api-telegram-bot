import { ReadStream } from "fs";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { isObject } from "util";

import { Bot } from "./Bot";
import { debug } from "./debug";
import {
  Message,
  MessageActions,
  SendMessageOptionals,
  TelegramResponse,
  Update,
  WrappedMessageActions,
} from "./interfaces";

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

export const createMessageActions = (message: Message, bot: Bot): MessageActions => {
  return {
    banChatMember: (until: number = 0): Promise<TelegramResponse<boolean>> => {
      debug("ban member");

      return bot.kickChatMember(message.chat.id, message.from.id, until);
    },

    deleteMessage: (): Promise<TelegramResponse<boolean>> => {
      debug("deleting message");

      return bot.deleteMessage(message.chat.id, message.message_id);
    },

    reply: (text: string, optionals?: SendMessageOptionals): Promise<TelegramResponse<Message>> => {
      debug("replying message");

      optionals = optionals || {} as SendMessageOptionals;
      optionals.reply_to_message_id = message.message_id;

      return bot.sendMessage(message.chat.id, text, optionals);
    },
  };
};

export const isParamsObj = <T>(obj): obj is T => isObject(obj);

/**
 * receive a object and stringify sub-objects to send via form-data
 * @beta
 */
export const stringifyFormData = (formData: any) => {
  const objKeys = Object.keys(formData);

  for (const key of objKeys) {
    if (typeof formData[key] === "object" && !(formData[key] instanceof ReadStream)) {
      formData[key] = JSON.stringify(formData[key]);
    }
  }

  return formData;
};

export interface ExplicitTypedUpdate {
  type: string;
  update: Update;
}

export const checkUpdateType = (update: Update): ExplicitTypedUpdate => {
  for (const updateType of _updateTypes) {
    if (updateType in update) {
      return {
        type: updateType,
        update,
      };
    }
  }

  return {
    type: null,
    update,
  };
};

export const createFilteredUpdateObservable =
  (originObservable: Observable<ExplicitTypedUpdate>, updateType: string): Observable<Update> =>
    originObservable.pipe(
      filter(({ type }) => type === updateType),
      map(({ update }) => update),
    );

export const createFilteredMessageObservable =
  (originObservable: Observable<WrappedMessageActions>, messageType: string): Observable<WrappedMessageActions> =>
    originObservable.pipe(filter(({ update }) => messageType in update.message));
