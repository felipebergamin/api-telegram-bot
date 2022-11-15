export default interface GetUpdates {
  /**
   * Identifier of the first update to be returned.
   */
  offset?: number;
  /**
   * Limits the number of updates to be retrieved. Values between 1—100 are accepted.
   */
  limit?: number;
  /**
   * Timeout in seconds for long polling.
   */
  timeout?: number;
  /**
   * List the types of updates you want your bot to receive.
   * For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
   */
  allowed_updates?: string[];
}
