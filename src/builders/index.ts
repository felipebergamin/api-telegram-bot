import { InlineKeyboardButton, KeyboardButton } from '../interfaces';
import { isEmpty, lastRowIndex, lastRowOf } from './utils';

/**
 * A helper function to build telegram keyboard
 */
export function KeyboardBuilder(keyboard = [[]]) {
  return {
    keyboard,

    /**
     * Add a row at the end of keyboard
     */
    newRow() {
      return isEmpty(lastRowOf(keyboard))
        ? KeyboardBuilder([...keyboard])
        : KeyboardBuilder([
          ...keyboard,
          [],
        ]);
    },

    /**
     * Add a button on last keyboard row
     * @param btn InlineKeyboardButton, KeyboardButton or a simple string
     */
    button(btn: string | InlineKeyboardButton | KeyboardButton) {
      keyboard[lastRowIndex(keyboard)] = [
        ...lastRowOf(keyboard),
        typeof btn === 'object' ? { ...btn } : btn,
      ];

      return KeyboardBuilder([...keyboard]);
    },
  };
}
