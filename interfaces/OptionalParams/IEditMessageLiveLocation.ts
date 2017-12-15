import { IInlineKeyboardMarkup as InlineKeyboardMarkup } from "../IInlineKeyboardMarkup";

export interface IEditMessageLiveLocationOptionals {
  chat_id?: number|string;
  message_id?: number;
  inline_message_id?: string;
  reply_markup?: InlineKeyboardMarkup;
}
