import { ReadStream } from "fs";
import { isObject } from "util";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Message, MessageActions, SendMessageOptionals, TelegramResponse } from "./interfaces";

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
