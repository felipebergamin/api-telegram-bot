import { ShippingAddress } from './ShippingAddress';

export interface OrderInfo {
  /** Optional. User name */
  name?: string;
  /** Optional. User's phone number */
  phone_number?: string;
  /** Optional. User email */
  email?: string;
  /** Optional. User shipping address */
  shipping_address?: ShippingAddress;
}
