export default interface Invoice {
  /** Product name */
  title: string;
  /** Product description */
  description: string;
  /** Unique bot deep-linking parameter that can be used to generate this invoice */
  start_parameter: string;
  /** Three-letter ISO 4217 currency code */
  currency: string;
  /** Total price in the smallest units of the currency (integer, not float/double). */
  total_amount: number;
}
