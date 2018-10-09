import { ForceReply} from "../ForceReply";
import { InlineKeyboardMarkup} from "../InlineKeyboardMarkup";
import { OnReplyCallbackFunction } from "../OnReceiveReplyCallback";
import { ReplyKeyboardMarkup} from "../ReplyKeyboardMarkup";
import { ReplyKeyboardRemove} from "../ReplyKeyboardRemove";

export interface SendDocumentOptionals {
  caption?: string;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply;

  onReceiveReply?: OnReplyCallbackFunction;
}
