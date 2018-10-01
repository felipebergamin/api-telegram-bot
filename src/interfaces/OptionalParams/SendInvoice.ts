import { InlineKeyboardMarkup } from "../InlineKeyboardMarkup";

export interface SendInvoiceOptionals {
  provider_data?: string;
  photo_url?: string;
  photo_size?: number;
  photo_width?: number;
  photo_height?: number;
  need_name?: boolean;
  need_phone_number?: boolean;
  need_email?: boolean;
  need_shipping_address?: boolean;
  is_flexible?: boolean;
  disable_notification?: boolean;
  reply_to_message_id?: number;
  reply_markup?: InlineKeyboardMarkup;
}
