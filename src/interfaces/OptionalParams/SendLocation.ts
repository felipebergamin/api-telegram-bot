import { OnReplyCallbackFunction } from '../../types';
import { CallbackQueryHandlerFunction } from '../CallbackQueryHandler';
import { ForceReply } from '../ForceReply';
import { InlineKeyboardMarkup } from '../InlineKeyboardMarkup';
import { ReplyKeyboardMarkup } from '../ReplyKeyboardMarkup';
import { ReplyKeyboardRemove } from '../ReplyKeyboardRemove';

export interface SendLocationOptionals {
  /**
   * Period in seconds for which the location will be updated (should be between 60 and 86400)
   */
  live_period?: number;
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
