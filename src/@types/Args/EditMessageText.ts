import type ReplyMarkup from './ReplyMarkup';

export default interface EditMessageText {
  text: string;
  /**
   * Required if `inline_message_id` is not specified.
   * Unique identifier for the target chat or username of the target channel
   */
  chat_id?: number | string;
  /**
   * Required if `inline_message_id` is not specified. Identifier of the sent message
   */
  message_id?: number;
  /**
   * Required if `chat_id` and `message_id` are not specified. Identifier of the inline message.
   */
  inline_message_id?: string;
  /**
   * Send Markdown or HTML.
   */
  parse_mode?: string;
  /**
   * Disables link previews for links in this message
   */
  disable_web_page_preview?: boolean;
  /**
   * A JSON-serialized object for an inline keyboard.
   */
  reply_markup?: ReplyMarkup;
}
