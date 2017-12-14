import { IShippingAddress as ShippingAddress } from "./IShippingAddress";
import { IUser as User } from "./IUser";

export interface IShippingQuery {
  id: string;
  from: User;
  invoice_payload: string;
  shipping_address: ShippingAddress;
}
