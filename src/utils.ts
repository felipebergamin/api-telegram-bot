import { ReadStream } from 'fs';

import Bot from './Bot';
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
} from './interfaces';

/** @ignore */
export const createMessageActions = (
  message: Message,
  bot: Bot
): MessageActions => {
  return {
    banChatMember: (until: number = 0): Promise<TelegramResponse<boolean>> => {
      return bot.kickChatMember(message.chat.id, message.from.id, until);
    },

    deleteMessage: (): Promise<TelegramResponse<boolean>> => {
      return bot.deleteMessage(message.chat.id, message.message_id);
    },

    reply: (
      text: string,
      optionals: SendMessageOptionals = {}
    ): Promise<TelegramResponse<Message>> => {
      return bot.sendMessage(message.chat.id, text, {
        ...optionals,
        reply_to_message_id: message.message_id,
      });
    },
  };
};

export const createCallbackQueryActions = (
  { message, ...cbkQuery }: CallbackQuery,
  bot: Bot
): CallbackQueryActions => {
  if (!message) return {};
  return {
    banChatMember: (until: number = 0) =>
      bot.kickChatMember(message.chat.id, message.from.id, until),

    deleteMessage: () => {
      return bot.deleteMessage(message.chat.id, message.message_id);
    },

    answerQuery: (opt: AnswerCallbackQueryOptionals = {}) => {
      return bot.answerCallbackQuery(cbkQuery.id, opt);
    },

    editMessageText: (text: string, opt: EditMessageTextOptionals = {}) => {
      return bot.editMessageText(text, {
        ...opt,
        chat_id: message.chat.id,
        message_id: message.message_id,
      });
    },

    // tslint:disable-next-line: max-line-length
    editMessageReplyMarkup: (
      reply_markup:
        | InlineKeyboardMarkup
        | ReplyKeyboardMarkup
        | ReplyKeyboardRemove
        | ForceReply
    ) => {
      return bot.editMessageReplyMarkup({
        chat_id: message.chat.id,
        message_id: message.message_id,
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
export const stringifyFormData = (formData: { [key: string]: any }) => {
  const parsedData: typeof formData = {};
  Object.keys(formData).forEach((key) => {
    if (
      typeof formData[key] === 'object' &&
      !(formData[key] instanceof ReadStream)
    ) {
      parsedData[key] = JSON.stringify(formData[key]);
    }
  });

  return formData;
};
