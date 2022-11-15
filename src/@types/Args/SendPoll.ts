import type ReplyMarkup from './ReplyMarkup';

export default interface SendPoll {
  chat_id: string | number;
  question: string;
  options: string[];
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disable_notification: boolean;
  /**
   * If the message is a reply, ID of the original message
   */
  reply_to_message_id: number;
  /**
   * Additional interface options.
   */
  reply_markup: ReplyMarkup;
}
