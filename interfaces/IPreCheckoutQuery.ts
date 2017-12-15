import { IOrderInfo as OrderInfo } from "./IOrderInfo";
import { IUser as User } from "./IUser";

export interface IPreCheckoutQuery {
  id: string;
  from: User;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id: string;
  order_info: OrderInfo;
}
