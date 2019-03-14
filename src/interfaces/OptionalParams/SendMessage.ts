import { OnReplyCallbackFunction } from "../../types";
import { CallbackQueryHandlerFunction } from "../CallbackQueryHandler";
import { ForceReply} from "../ForceReply";
import { InlineKeyboardMarkup} from "../InlineKeyboardMarkup";
import { ReplyKeyboardMarkup} from "../ReplyKeyboardMarkup";
import { ReplyKeyboardRemove} from "../ReplyKeyboardRemove";

export interface SendMessageOptionals {
  /**
   * Send Markdown or HTML, if you want Telegram apps to show
   * bold, italic, fixed-width text or inline URLs in your bot"s message.
   */
  parse_mode?: string;
  /**
   * Disables link previews for links in this message
   */
  disable_web_page_preview?: boolean;
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
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;
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

  readonly [propName: string]: any;
}
