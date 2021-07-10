import { InlineKeyboardMarkup } from '../InlineKeyboardMarkup';

export interface SendInvoiceOptionals {
  /** JSON-encoded data about the invoice, which will be shared with the payment provider */
  provider_data?: string;
  /** URL of the product photo for the invoice */
  photo_url?: string;
  /** Photo size */
  photo_size?: number;
  /** Photo width */
  photo_width?: number;
  /** Photo height */
  photo_height?: number;
  /** Pass True, if you require the user's full name to complete the order */
  need_name?: boolean;
  /** Pass True, if you require the user's phone number to complete the order */
  need_phone_number?: boolean;
  /** Pass True, if you require the user's email to complete the order */
  need_email?: boolean;
  /** Pass True, if you require the user's shipping address to complete the order */
  need_shipping_address?: boolean;
  /** Pass True, if the final price depends on the shipping method */
  is_flexible?: boolean;
  /** Sends the message silently. */
  disable_notification?: boolean;
  /** If the message is a reply, ID of the original message */
  reply_to_message_id?: number;
  /** A JSON-serialized object for an inline keyboard. */
  reply_markup?: InlineKeyboardMarkup;
}
