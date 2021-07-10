import { KeyboardButton } from './KeyboardButton';

/** @see {@link https://core.telegram.org/bots/api#replykeyboardmarkup} */
export interface ReplyKeyboardMarkup {
  /**
   * Array of button rows, each represented by an Array of KeyboardButton objects
   */
  keyboard: [KeyboardButton[]];
  /**
   * Optional. Requests clients to resize the keyboard vertically for optimal fit
   */
  resize_keyboard?: boolean;
  /**
   * Optional. Requests clients to hide the keyboard as soon as it's been used.
   */
  one_time_keyboard?: boolean;
  /**
   * Optional. Use this parameter if you want to show the keyboard to specific users only.
   * See telegram official docs to more info.
   */
  selective?: boolean;
}
