import { InlineKeyboardButton, KeyboardButton } from '../interfaces';
import { isEmpty, lastRowOf } from './utils';

type Button = string | InlineKeyboardButton | KeyboardButton;

/**
 * A helper function to build telegram keyboard
 */
export function KeyboardBuilder(keyboard: Button[][] = [[]]) {
  return {
    keyboard,

    /**
     * Add a row at the end of keyboard
     */
    newRow() {
      return isEmpty(lastRowOf(keyboard))
        ? KeyboardBuilder([...keyboard])
        : KeyboardBuilder([...keyboard, []]);
    },

    /**
     * Add a button on last keyboard row
     * @param btn InlineKeyboardButton, KeyboardButton or a simple string
     */
    button(btn: string | InlineKeyboardButton | KeyboardButton) {
      const lastRow = keyboard.length - 1;
      return KeyboardBuilder(
        keyboard.map((row, index) => (index === lastRow ? [...row, btn] : row))
      );
    },
  };
}

export default KeyboardBuilder;
