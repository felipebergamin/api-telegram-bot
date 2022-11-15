import type { ReadStream } from "fs";

import type InlineKeyboardMarkup from "../../@types/Args/InlineKeyboardMarkup";
import type ReplyKeyboardMarkup from "../../@types/Args/ReplyKeyboardMarkup";
import type ReplyKeyboardRemove from "../../@types/Args/ReplyKeyboardRemove";
import type ForceReply from "../../@types/Args/ForceReply";
import type OnReplyCallbackFunction from "../../@types/Args/OnReplyCallbackFunction";
import type { CallbackQueryHandlerFunction } from "../../@types/Args/CallbackQueryHandler";

export default interface SendPhoto {
  chat_id: number | string;
  photo: ReadStream;
  /**
   * Photo caption (may also be used when resending photos by file_id), 0-200 characters
   */
  caption?: string;
  /** Optional. Send Markdown or HTML */
  parse_mode?: string;
  /**
   * Sends the message silently.
   * iOS users will not receive a notification, Android users will receive a notification with no sound.
   */
  disable_notification?: boolean;
  /**
   * If the message is a reply, ID of the original message.
   */
  reply_to_message_id?: number;
  /**
   * Additional interface options.
   * A JSON-serialized object for an inline keyboard, custom reply keyboard,
   * instructions to remove reply keyboard or to force a reply from the user.
   */
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
  /**
   * a function that will be called if user reply the sent message.
   * Note: the user must explicity reply the message (tap message on telegram app and "Reply")
   */
  onReceiveReply?: OnReplyCallbackFunction;
  /**
   * a function that will be called when user tap a inline_keyboard button in sent message
   */
  onCallbackQuery?: CallbackQueryHandlerFunction;
  /**
   * Any data that onReceiveReply function will receive as 3th parameter.
   * You can use this to "remind" something from previous user messages.
   */
  data?: any;
}
