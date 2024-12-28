import type {
  AnswerCallbackQuery,
  EditMessageText,
  Message,
} from './generated';
import type { ReplyMarkup } from './ReplyMarkup';
import type TelegramResponse from './TelegramResponse';

export default interface CallbackQueryActions {
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
    opt?: Omit<AnswerCallbackQuery, 'callback_query_id'>,
  ) => Promise<TelegramResponse<boolean>>;

  editMessageText?: (
    args: EditMessageText,
  ) => Promise<TelegramResponse<Message | boolean>>;

  editMessageReplyMarkup?: (
    reply_markup: ReplyMarkup,
  ) => Promise<TelegramResponse<Message | boolean>>;
}
