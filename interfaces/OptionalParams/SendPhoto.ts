import { ForceReply} from "../ForceReply";
import { InlineKeyboardMarkup} from "../InlineKeyboardMarkup";
import { ReplyKeyboardMarkup} from "../ReplyKeyboardMarkup";
import { ReplyKeyboardRemove} from "../ReplyKeyboardRemove";

export interface SendPhotoOptionals {
  caption?: string;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;
}
