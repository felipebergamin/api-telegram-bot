import type ReplyMarkup from './ReplyMarkup';

export default interface SendContact {
  chat_id: number | string;
  phone_number: string;
  first_name: string;
  /**
   * Contact"s last name
   */
  last_name?: string;
  /**
   * Additional data about the contact in the form of a vCard, 0-2048 bytes
   */
  vcard?: string;
  /**
   * Sends the message silently.
   */
  disable_notification?: boolean;
  /**
   * If the message is a reply, ID of the original message
   */
  reply_to_message_id?: number;
  /**
   * Additional interface options.
   */
  reply_markup?: ReplyMarkup;
}
