import { IShippingAddress as ShippingAddress } from "./IShippingAddress";

export interface IOrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}
