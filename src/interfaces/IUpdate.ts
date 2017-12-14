import { ICallbackQuery as CallbackQuery } from "./ICallbackQuery";
import { IChosenInlineResult as ChosenInlineResult } from "./IChosenInlineResult";
import { IInlineQuery as InlineQuery } from "./IInlineQuery";
import { IMessage as Message } from "./IMessage";
import { IPreCheckoutQuery as PreCheckoutQuery } from "./IPreCheckoutQuery";
import { IShippingQuery as ShippingQuery } from "./IShippingQuery";

export interface IUpdate {
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
