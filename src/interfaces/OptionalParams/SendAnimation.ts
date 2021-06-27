import { ReadStream } from 'fs';

import { ForceReply } from '../ForceReply';
import { InlineKeyboardMarkup } from '../InlineKeyboardMarkup';
import { ReplyKeyboardMarkup } from '../ReplyKeyboardMarkup';
import { ReplyKeyboardRemove } from '../ReplyKeyboardRemove';

export interface SendAnimationOptionals {
  /** Duration of sent animation in seconds */
  duration: number;
  /** Animation width */
  width: number;
  /** Animation height */
  height: number;
  /** Thumbnail of the file sent. */
  thumb: ReadStream | string;
  /** Animation caption (may also be used when resending animation by file_id), 0-1024 characters */
  caption: string;
  /** Send Markdown or HTML */
  parse_mode: string;
  /** Sends the message silently. Users will receive a notification with no sound. */
  disable_notification: boolean;
  /** If the message is a reply, ID of the original message */
  reply_to_message_id: number;
  /** Additional interface options */
  reply_markup:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
}
