import { CallbackQuery } from "./CallbackQuery";
import { ChosenInlineResult } from "./ChosenInlineResult";
import { InlineQuery } from "./InlineQuery";
import { Message } from "./Message";
import { PreCheckoutQuery } from "./PreCheckoutQuery";
import { ShippingQuery } from "./ShippingQuery";

export interface Update {
  readonly update_id: number;
  readonly message?: Message;
  readonly edited_message?: Message;
  readonly channel_post?: Message;
  readonly edited_channel_post?: Message;
  readonly inline_query?: InlineQuery;
  readonly chosen_inline_result?: ChosenInlineResult;
  readonly callback_query?: CallbackQuery;
  readonly shipping_query?: ShippingQuery;
  readonly pre_checkout_query?: PreCheckoutQuery;

  readonly [propName: string]: any;
}
