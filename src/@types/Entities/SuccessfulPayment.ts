import type OrderInfo from './OrderInfo';

export default interface SuccessfulPayment {
  /**
   * Three-letter ISO 4217 currency code
   */
  currency: string;
  /**
   * Total price in the smallest units of the currency (integer, not float/double).
   */
  total_amount: number;
  /**
   * Bot specified invoice payload
   */
  invoice_payload: string;
  /**
   * Optional. Identifier of the shipping option chosen by the user
   */
  shipping_option_id?: string;
  /**
   * Optional. Order info provided by the user
   */
  order_info?: OrderInfo;
  /**
   * Telegram payment identifier
   */
  telegram_payment_charge_id: string;
  /**
   * Provider payment identifier
   */
  provider_payment_charge_id: string;
}
