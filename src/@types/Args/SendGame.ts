import type ReplyMarkup from './ReplyMarkup';

export default interface SendGame {
  chat_id: number;
  game_short_name: string;
  /**
   * Sends the message silently.
   */
  disable_notification?: boolean;
  /**
   * If the message is a reply, ID of the original message
   */
  reply_to_message_id?: number;
  /**
   * A JSON-serialized object for an inline keyboard.
   */
  reply_markup?: ReplyMarkup;
}
