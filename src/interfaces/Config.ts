export interface Config {
  /**
   * if true, texts will be emojified before send. Default: `true`
   * @see {@link https://www.npmjs.com/package/node-emoji }
   */
  emojifyTexts?: boolean;

  /**
   * If true, a corresponding chat_action will be send before the message.
   * Example: `upload_photo` will be send before a photo.
   * Default: `true`
   */
  sendChatActionBeforeMsg?: boolean;
}
