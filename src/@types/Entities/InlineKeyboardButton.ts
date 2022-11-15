/** @see {@link https://core.telegram.org/bots/api#inlinekeyboardbutton} */
export interface InlineKeyboardButton {
  /** Label text on the button */
  text: string;
  /** Optional. HTTP or tg:// url to be opened when button is pressed */
  url?: string;
  /**  	Optional. Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes */
  callback_data?: string;
  /**
   * Optional. If set, pressing the button will prompt the user to select one of their chats,
   * open that chat and insert the bot‘s username and the specified inline query in the input field.
   */
  switch_inline_query?: string;
  /**
   * Optional. If set, pressing the button will insert the bot‘s
   * username and the specified inline query in the current chat's input field.
   */
  switch_inline_query_current_chat?: string;
  /**
   *  	Optional. Description of the game that will be launched when the user presses the button.
   */
  callback_game?: any;
  /** Optional. Specify True, to send a Pay button. */
  pay?: boolean;
}
