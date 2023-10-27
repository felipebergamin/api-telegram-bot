export default interface SendMessage {
  /**
   * Unique identifier for the target chat or username of the target channel (in the format @channelusername)
   */
  chat_id: number | string;

  /**
   * Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
   */
  message_thread_id?: number;

  /**
   * Text of the message to be sent, 1-4096 characters after entities parsing
   */
  text: string;

  /**
   * Mode for parsing entities in the message text. See formatting options for more details.
   */
  parse_mode?: string;

  /**
   * A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
   */
  entities?: Array<MessageEntity>;

  /**
   * Disables link previews for links in this message
   */
  disable_web_page_preview?: boolean;

  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disable_notification?: boolean;

  /**
   * Protects the contents of the sent message from forwarding and saving
   */
  protect_content?: boolean;

  /**
   * If the message is a reply, ID of the original message
   */
  reply_to_message_id?: number;

  /**
   * Pass True if the message should be sent even if the specified replied-to message is not found
   */
  allow_sending_without_reply?: boolean;

  /**
   * Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user.
   */
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
}
