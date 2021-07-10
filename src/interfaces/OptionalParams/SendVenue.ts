import { ForceReply } from '../ForceReply';
import { InlineKeyboardMarkup } from '../InlineKeyboardMarkup';
import { ReplyKeyboardMarkup } from '../ReplyKeyboardMarkup';
import { ReplyKeyboardRemove } from '../ReplyKeyboardRemove';

export interface SendVenueOptionals {
  /**
   * Foursquare identifier of the venue
   */
  foursquare_id?: string;
  /**
   * Optional. Foursquare type of the venue.
   * (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
   */
  foursquare_type: string;
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
  reply_markup?:
    | InlineKeyboardMarkup
    | ReplyKeyboardMarkup
    | ReplyKeyboardRemove
    | ForceReply;
}
