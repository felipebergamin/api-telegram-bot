import { ReadStream } from "fs";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

import { Bot } from "./Bot";
import { debug } from "./debug";
import {
  AnswerCallbackQueryOptionals,
  CallbackQuery,
  CallbackQueryActions,
  EditMessageTextOptionals,
  ForceReply,
  InlineKeyboardMarkup,
  Message,
  MessageActions,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  SendMessageOptionals,
  TelegramResponse,
  Update,
  WrappedMessageActions,
} from "./interfaces";

/** @ignore */
export const _messageTypes = [
  "text", "audio", "document", "game", "photo", "sticker", "video", "voice", "video_note",
  "contact", "location", "venue", "new_chat_members", "left_chat_member", "new_chat_title",
  "new_chat_photo", "delete_chat_photo", "group_chat_created", "supergroup_chat_created",
  "channel_chat_created", "pinned_message", "invoice", "successful_payment",
];
/** @ignore */
export const _updateTypes = [
  "message", "edited_message", "channel_post", "edited_channel_post",
  "inline_query", "chosen_inline_result", "callback_query", "shipping_query",
  "pre_checkout_query",
];

/** @ignore */
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

export const createCallbackQueryActions = (cbkQuery: CallbackQuery, bot: Bot): CallbackQueryActions => {
  return {
    banChatMember: (until: number = 0) => {
      debug(`CallbackQueryActions: ban chat member ${cbkQuery.message.chat.id} / ${cbkQuery.message.from.id}`);

      return bot.kickChatMember(cbkQuery.message.chat.id, cbkQuery.message.from.id, until);
    },

    deleteMessage: () => {
      debug(`CallbackQueryActions: deleting message ${cbkQuery.message.message_id}`);

      return bot.deleteMessage(cbkQuery.message.chat.id, cbkQuery.message.message_id);
    },

    answerQuery: (opt: AnswerCallbackQueryOptionals = {}) => {
      debug(`CallbackQueryActions: answering callback_query ${cbkQuery.id}`);
      return bot.answerCallbackQuery(cbkQuery.id, opt);
    },

    editMessageText: (text: string, opt: EditMessageTextOptionals = {}) => {
      debug(`CallbackQueryActions: editing message(${cbkQuery.message.message_id}) text`);
      return bot.editMessageText(
        text,
        {
          ...opt,
          chat_id: cbkQuery.message.chat.id,
          message_id: cbkQuery.message.message_id,
        },
      );
    },

    // tslint:disable-next-line: max-line-length
    editMessageReplyMarkup: (reply_markup: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove | ForceReply) => {
      return bot.editMessageReplyMarkup({
        chat_id: cbkQuery.message.chat.id,
        message_id: cbkQuery.message.message_id,
        reply_markup,
      });
    },
  };
};

/**
 * receive a object and stringify sub-objects to send via form-data
 * @ignore
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

/** @ignore */
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

/** @ignore */
export const createFilteredUpdateObservable =
  (originObservable: Observable<ExplicitTypedUpdate>, updateType: string): Observable<Update> =>
    originObservable.pipe(
      filter(({ type }) => type === updateType),
      map(({ update }) => update),
    );

/** @ignore */
export const createFilteredMessageObservable =
  (originObservable: Observable<WrappedMessageActions>, messageType: string): Observable<WrappedMessageActions> =>
    originObservable.pipe(filter(({ update }) => messageType in update.message));
