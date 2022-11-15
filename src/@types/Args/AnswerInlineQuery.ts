export default interface AnswerInlineQuery {
  inline_query_id: string;
  results: any[];
  /**
   * The maximum amount of time in seconds that the result of the inline query may be cached on the server.
   */
  cache_time?: number;
  /**
   * Pass True, if results may be cached on the server side only for the user that sent the query.
   * By default, results may be returned to any user who sends the same query
   */
  is_personal?: boolean;
  /**
   * Pass the offset that a client should send in the next query with the same text to receive more results.
   * Pass an empty string if there are no more results or if you don‘t support pagination.
   */
  next_offset?: string;
  /**
   * If passed, clients will display a button with specified text that switches the user to a private chat with the bot
   * and sends the bot a start message with the parameter switch_pm_parameter
   */
  switch_pm_text?: string;
  /**
   * Parameter for the start message sent to the bot when user presses the switch button
   */
  switch_pm_parameter?: string;
}
