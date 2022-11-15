import type ShippingOption from '../Entities/ShippingOption';

export default interface AnswerShippingQuery {
  shipping_query_id: string;
  ok: boolean;
  /**
   * Required if ok is True. A JSON-serialized array of available shipping options
   */
  shipping_options?: ShippingOption[];
  /**
   * Required if ok is False.
   * Error message in human readable form that explains why it is impossible to complete the order
   */
  error_message?: string;
}
