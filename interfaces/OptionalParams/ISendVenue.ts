import { IForceReply as ForceReply} from "../IForceReply";
import { IInlineKeyboardMarkup as InlineKeyboardMarkup} from "../IInlineKeyboardMarkup";
import { IReplyKeyboardMarkup as ReplyKeyboardMarkup} from "../IReplyKeyboardMarkup";
import { IReplyKeyboardRemove as ReplyKeyboardRemove} from "../IReplyKeyboardRemove";

export interface ISendVenueOptionals {
  foursquare_id?: string;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;
}
