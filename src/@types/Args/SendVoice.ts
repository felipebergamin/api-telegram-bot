import type { ReadStream } from 'fs';

import type ReplyMarkup from './ReplyMarkup';

export default interface SendVoice {
  chat_id: number | string;
  voice: ReadStream | string;
  /**
   * Voice message caption, 0-200 characters
   */
  caption?: string;
  /** Optional. Send Markdown or HTML */
  parse_mode?: string;
  /**
   * Duration of the voice message in seconds
   */
  duration?: number;
  /**
   * Sends the message silently.
   */
  disable_notification?: boolean;
  /**
   * If the message is a reply, ID of the original message
   */
  reply_to_message_id?: number;
  /**
   * Additional interface options.
   * A JSON-serialized object for an inline keyboard, custom reply keyboard,
   * instructions to remove reply keyboard or to force a reply from the user.
   */
  reply_markup?: ReplyMarkup;
}
