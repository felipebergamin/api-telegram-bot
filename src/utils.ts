import type CallbackQueryActions from './@types/CallbackQueryActions';
import type { MessageActions } from './@types/MessageActions';
import type { Message, CallbackQuery } from './@types/generated';

import type Bot from './Bot';

export const createMessageActions = (
  message: Message,
  bot: Bot,
): MessageActions => {
  return {
    banChatMember: (until = 0) =>
      bot.call('banChatMember', {
        chat_id: message.chat.id,
        user_id: message?.from?.id,
        until_date: until,
      }),
    deleteMessage: () =>
      bot.call('deleteMessage', {
        chat_id: message.chat.id,
        message_id: message.message_id,
      }),
    reply: (args) => {
      const mandatoryArgs = {
        chat_id: message.chat.id,
        reply_to_message_id: message.message_id,
      };
      const callArgs = typeof args === 'string' ? { text: args } : args;
      return bot.call('sendMessage', {
        ...callArgs,
        ...mandatoryArgs,
      });
    }
  };
};

export const createCallbackQueryActions = (
  { message, ...cbkQuery }: CallbackQuery,
  bot: Bot,
): CallbackQueryActions => {
  if (!message) return {};
  return {
    banChatMember: (until = 0) =>
      bot.call('banChatMember', {
        chat_id: message.chat.id,
        user_id: (message as Message).from?.id,
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
