import { IForceReply as ForceReply} from "../IForceReply";
import { IInlineKeyboardMarkup as InlineKeyboardMarkup} from "../IInlineKeyboardMarkup";
import { IReplyKeyboardMarkup as ReplyKeyboardMarkup} from "../IReplyKeyboardMarkup";
import { IReplyKeyboardRemove as ReplyKeyboardRemove} from "../IReplyKeyboardRemove";

export interface IEditMessageTextOptionals {
  chat_id?: number|string;
  message_id?: number;
  inline_message_id?: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;
}
