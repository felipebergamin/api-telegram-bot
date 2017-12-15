import { IForceReply as ForceReply} from "../IForceReply";
import { IInlineKeyboardMarkup as InlineKeyboardMarkup} from "../IInlineKeyboardMarkup";
import { IReplyKeyboardMarkup as ReplyKeyboardMarkup} from "../IReplyKeyboardMarkup";
import { IReplyKeyboardRemove as ReplyKeyboardRemove} from "../IReplyKeyboardRemove";

export interface ISendMessageOptionals {
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;

  readonly [propName: string]: any;
}
