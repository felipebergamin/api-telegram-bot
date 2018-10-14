export interface SendMediaGroupOptionals {
  /**
   * Sends the messages silently. Users will receive a notification with no sound
   */
  disable_notification?: boolean;
  /**
   * If the messages are a reply, ID of the original message
   */
  reply_to_message_id?: number;
}
