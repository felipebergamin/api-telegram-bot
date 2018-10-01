import { InlineKeyboardButton } from "../interfaces/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "../interfaces/InlineKeyboardMarkup";

export class InlineKeyboardBuilder implements InlineKeyboardMarkup {
  public inline_keyboard: [InlineKeyboardButton[]];

  /**
   * @class {InlineKeyboardBuilder}
   * @constructor
   * @see {@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
   */
  constructor() {
      this.inline_keyboard = [[]];
  }

  /**
   * Append a new row to keyboard. New buttons will be added on new row.
   * @chainable
   */
  public appendRow() {
    if (this.getLastRow().length > 0) {
      this.inline_keyboard.push([]);
    }
    return this;
  }

  /**
   * Add a new button on last row
   * @param {InlineKeyboardButton} button The button object
   * @chainable
   */
  public addButton(button: InlineKeyboardButton) {
    this.getLastRow().push(button);
    return this;
  }

  /**
   * Distribute an array of Buttons in rows, respecting a limit of buttons for each row
   * @param {Array} array_btn The array of InlineKeyboardButton
   * @param {Number} [maxButtonsInRow=1] Max buttons allowed on each row
   * @chainable
   */
  public distributeButtonsInRows(array_btn: InlineKeyboardButton[], maxButtonsInRow: number = 1) {
      array_btn.forEach((button: InlineKeyboardButton) => {
          // se não cabem mais botões na linha atual
          if (! (this.getLastRow().length < maxButtonsInRow)) {
            this.appendRow();
          }

          this.addButton(button);
      });

      return this;
  }

  private getRowsCount(): number {
    return this.inline_keyboard.length;
  }

  private getLastRow() {
    if (this.getRowsCount() === 0) {
      this.appendRow();
    }
    return this.inline_keyboard[this.getRowsCount() - 1];
  }
}
