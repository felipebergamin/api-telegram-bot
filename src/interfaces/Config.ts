export interface Config {
  /**
   * telegram' allow messages with max length 4096 characters
   * if true, #sendMessage function will split messages long messages
   * by pieces of 4096 characters and send them all sequentially.
   * Default: `true`
   */
  splitLongMessages?: boolean;

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
