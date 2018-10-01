import { ForceReply} from "../ForceReply";
import { InlineKeyboardMarkup} from "../InlineKeyboardMarkup";
import { ReplyKeyboardMarkup} from "../ReplyKeyboardMarkup";
import { ReplyKeyboardRemove} from "../ReplyKeyboardRemove";

export interface EditMessageTextOptionals {
  chat_id?: number|string;
  message_id?: number;
  inline_message_id?: string;
  parse_mode?: string;
  disable_web_page_preview?: boolean;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;
}
