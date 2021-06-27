import { ReplyMarkup } from '../../types';

export interface SendPollOptionals {
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disable_notification: boolean;
  /**
   * If the message is a reply, ID of the original message
   */
  reply_to_message_id: number;
  /**
   * Additional interface options.
   */
  reply_markup: ReplyMarkup;
}
