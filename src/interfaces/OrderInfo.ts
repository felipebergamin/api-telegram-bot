import { ShippingAddress } from "./ShippingAddress";

export interface OrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: ShippingAddress;
}
