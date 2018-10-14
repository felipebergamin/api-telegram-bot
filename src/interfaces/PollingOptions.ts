export interface PollingOptions {
  /** Limits the number of updates to be retrieved. Values between 1—100 are accepted. Defaults to 100. */
  limit?: number;

  /**
   * Identifier of the first update to be returned.
   * The negative offset can be specified to retrieve
   * updates starting from -offset update from the end of the updates queue.
   */
  offset?: number;

  /**
   * List the types of updates you want your bot to receive.
   * For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types.
   */
  allowed_updates?: string[];

  /** Timeout in seconds for long polling. Default: 10 seconds */
  timeout?: number;
}
