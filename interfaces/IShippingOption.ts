import { ILabeledPrice } from "./ILabeledPrice";

export interface IShippingOption {
  id: string;
  title: string;
  prices: ILabeledPrice;
}
