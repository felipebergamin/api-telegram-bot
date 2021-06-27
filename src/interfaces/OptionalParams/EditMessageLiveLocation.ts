import { InlineKeyboardMarkup } from '../InlineKeyboardMarkup';

export interface EditMessageLiveLocationOptionals {
  /**
   * Required if inline_message_id is not specified. Unique identifier for the target chat
   */
  chat_id?: number | string;
  /**
   * Required if inline_message_id is not specified. Identifier of the sent message
   */
  message_id?: number;
  /**
   * Required if chat_id and message_id are not specified. Identifier of the inline message
   */
  inline_message_id?: string;
  /**
   * A JSON-serialized object for a new inline keyboard.
   */
  reply_markup?: InlineKeyboardMarkup;
}
