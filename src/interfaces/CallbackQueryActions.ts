import { ForceReply } from './ForceReply';
import { InlineKeyboardMarkup } from './InlineKeyboardMarkup';
import { Message } from './Message';
import {
  AnswerCallbackQueryOptionals,
  EditMessageTextOptionals,
} from './OptionalParams';
import { ReplyKeyboardMarkup } from './ReplyKeyboardMarkup';
import { ReplyKeyboardRemove } from './ReplyKeyboardRemove';
import { TelegramResponse } from './TelegramResponse';

export interface CallbackQueryActions {
  /**
   * Receives the date when the user will be unbanned, unix time.
   * If user is banned for more than 366 days or less than 30 seconds
   * from the current time they are considered to be banned forever
   * @param until date when the user will be unbanned
   * @see {@link https://core.telegram.org/bots/api#kickchatmember}
   */
  banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>;
  /**
   * delete the message, see limitations on telegram documentation
   * @see {@link https://core.telegram.org/bots/api#deletemessage}
   */
  deleteMessage?: () => Promise<TelegramResponse<boolean>>;

  answerQuery?: (
    opt?: AnswerCallbackQueryOptionals
  ) => Promise<TelegramResponse<boolean>>;

  editMessageText?: (
    text: string,
    opt?: EditMessageTextOptionals
  ) => Promise<TelegramResponse<Message | boolean>>;

  editMessageReplyMarkup?: (
    reply_markup:
      | InlineKeyboardMarkup
      | ReplyKeyboardMarkup
      | ReplyKeyboardRemove
      | ForceReply
  ) => Promise<TelegramResponse<Message | boolean>>;
}
