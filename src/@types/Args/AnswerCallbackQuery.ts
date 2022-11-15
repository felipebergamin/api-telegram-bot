export default interface AnswerCallbackQuery {
  callback_query_id: string;
  /**
   * Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters
   */
  text?: string;
  /**
   * If true, an alert will be shown by the client instead of a notification at the top of the chat screen.
   */
  show_alert?: boolean;
  /**
   *  URL that will be opened by the user"s client.
   */
  url?: string;
  /**
   * The maximum amount of time in seconds that the result of the callback query may be cached client-side.
   */
  cache_time?: number;
}
