export default interface ForceReply {
  /**
   * Shows reply interface to the user, as if they manually selected the bot‘s message and tapped ’Reply'
   */
  force_reply: boolean;
  /**
   * Optional. Use this parameter if you want to force reply from specific users only.
   */
  selective?: boolean;
}
