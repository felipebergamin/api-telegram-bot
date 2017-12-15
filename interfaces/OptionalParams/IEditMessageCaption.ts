import { IForceReply as ForceReply} from "../IForceReply";
import { IInlineKeyboardMarkup as InlineKeyboardMarkup} from "../IInlineKeyboardMarkup";
import { IReplyKeyboardMarkup as ReplyKeyboardMarkup} from "../IReplyKeyboardMarkup";
import { IReplyKeyboardRemove as ReplyKeyboardRemove} from "../IReplyKeyboardRemove";

export interface IEditMessageCaptionOptionals {
  chat_id?: number|string;
  message_id?: number;
  inline_message_id?: string;
  caption?: string;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;
}
