import { LabeledPrice } from "./LabeledPrice";

export interface ShippingOption {
  id: string;
  title: string;
  prices: LabeledPrice;
}
