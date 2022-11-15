import type ReplyMarkup from './ReplyMarkup';

export default interface StopPoll {
  chat_id: number | string;
  message_id: number;
  reply_markup?: ReplyMarkup;
}
