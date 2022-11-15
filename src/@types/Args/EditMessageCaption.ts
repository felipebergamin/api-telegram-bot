import type ReplyMarkup from './ReplyMarkup';

export default interface EditMessageCaption {
  /**
   * Required if `inline_message_id` is not specified.
   * Unique identifier for the target chat or username of the target channel.
   */
  chat_id?: number | string;
  /**
   * Required if `inline_message_id` is not specified. Identifier of the sent message
   */
  message_id?: number;
  /**
   * Required if `chat_id` and `message_id` are not specified. Identifier of the inline message
   */
  inline_message_id?: string;
  /**
   * New caption of the message
   */
  caption?: string;
  /** Optional. Send Markdown or HTML */
  parse_mode?: string;
  /**
   * A JSON-serialized object for an inline keyboard.
   */
  reply_markup?: ReplyMarkup;
}
