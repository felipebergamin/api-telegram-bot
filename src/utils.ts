import type CallbackQuery from './@types/Args/CallbackQuery';
import type CallbackQueryActions from './@types/Args/CallbackQueryActions';
import type { MessageActions } from './@types/Args/MessageActions';
import type Message from './@types/Entities/Message';

import type Bot from './Bot';

/** @ignore */
export const createMessageActions = (
  message: Message,
  bot: Bot,
): MessageActions => {
  return {
    banChatMember: (until = 0) =>
      bot.call('kickChatMember', {
        chat_id: message.chat.id,
        user_id: message.from.id,
        until_date: until,
      }),
    deleteMessage: () =>
      bot.call('deleteMessage', {
        chat_id: message.chat.id,
        message_id: message.message_id,
      }),
    reply: (args) =>
      bot.call('sendMessage', {
        ...args,
        chat_id: message.chat.id,
        reply_to_message_id: message.message_id,
      }),
  };
};

export const createCallbackQueryActions = (
  { message, ...cbkQuery }: CallbackQuery,
  bot: Bot,
): CallbackQueryActions => {
  if (!message) return {};
  return {
    banChatMember: (until = 0) =>
      bot.call('kickChatMember', {
        chat_id: message.chat.id,
        user_id: message.from.id,
        until_date: until,
      }),
    deleteMessage: () =>
      bot.call('deleteMessage', {
        chat_id: message.chat.id,
        message_id: message.message_id,
      }),

    answerQuery: (opt = {}) =>
      bot.call('answerCallbackQuery', {
        ...opt,
        callback_query_id: cbkQuery.id,
      }),

    editMessageText: (args) =>
      bot.call('editMessageText', {
        ...args,
        chat_id: message.chat.id,
        message_id: message.message_id,
      }),

    editMessageReplyMarkup: (reply_markup) =>
      bot.call('editMessageReplyMarkup', {
        chat_id: message.chat.id,
        message_id: message.message_id,
        reply_markup,
      }),
  };
};
