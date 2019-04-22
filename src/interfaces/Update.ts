import { CallbackQuery } from "./CallbackQuery";
import { ChosenInlineResult } from "./ChosenInlineResult";
import { InlineQuery } from "./InlineQuery";
import { Message } from "./Message";
import { Poll } from "./Poll";
import { PreCheckoutQuery } from "./PreCheckoutQuery";
import { ShippingQuery } from "./ShippingQuery";

export interface Update {
  /**
   * The update‘s unique identifier. Update identifiers start from a certain positive number and increase sequentially.
   */
  update_id: number;
  /**
   * Optional. New incoming message of any kind — text, photo, sticker, etc.
   */
  message?: Message;
  /**
   * Optional. New version of a message that is known to the bot and was edited
   */
  edited_message?: Message;
  /**
   * Optional. New incoming channel post of any kind — text, photo, sticker, etc.
   */
  channel_post?: Message;
  /**
   * Optional. New version of a channel post that is known to the bot and was edited
   */
  edited_channel_post?: Message;
  /**
   * Optional. New incoming inline query
   */
  inline_query?: InlineQuery;
  /**
   * Optional. The result of an inline query that was chosen by a user and sent to their chat partner.
   * Please see our documentation on the feedback collecting for details on how to enable these updates for your bot.
   */
  chosen_inline_result?: ChosenInlineResult;
  /**
   * Optional. New incoming callback query
   */
  callback_query?: CallbackQuery;
  /**
   * Optional. New incoming shipping query. Only for invoices with flexible price
   */
  shipping_query?: ShippingQuery;
  /**
   * Optional. New incoming pre-checkout query. Contains full information about checkout
   */
  pre_checkout_query?: PreCheckoutQuery;
  /**
   * New poll state.
   * Bots receive only updates about polls, which are sent or stopped by the bot
   */
  poll: Poll;

  [propName: string]: any;
}
