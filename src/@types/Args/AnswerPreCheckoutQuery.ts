export default interface AnswerPreCheckoutQuery {
  pre_checkout_query_id: string;
  ok: boolean;
  error_message?: string;
}
