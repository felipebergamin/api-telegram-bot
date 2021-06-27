import { InlineKeyboardButton } from './InlineKeyboardButton';

/** @see {@link https://core.telegram.org/bots/api#inlinekeyboardmarkup} */
export interface InlineKeyboardMarkup {
  /** Array of button rows, each represented by an Array of InlineKeyboardButton objects */
  inline_keyboard: InlineKeyboardButton[][];
}
