import type ShippingAddress from './ShippingAddress';
import type User from './User';

export default interface ShippingQuery {
  /**
   * Unique query identifier
   */
  id: string;
  /**
   * User who sent the query
   */
  from: User;
  /**
   * Bot specified invoice payload
   */
  invoice_payload: string;
  /**
   * User specified shipping address
   */
  shipping_address: ShippingAddress;
}
