import type { InlineKeyboardButton } from '../Entities/InlineKeyboardButton';

/** @see {@link https://core.telegram.org/bots/api#inlinekeyboardmarkup} */
export default interface InlineKeyboardMarkup {
  /** Array of button rows, each represented by an Array of InlineKeyboardButton objects */
  inline_keyboard: InlineKeyboardButton[][];
}
