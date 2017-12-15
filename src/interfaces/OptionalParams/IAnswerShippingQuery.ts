import { IShippingOption } from "../IShippingOption";

export interface IAnswerShippingQueryOptionals {
  shipping_options?: IShippingOption[];
  error_message?: string;
}
