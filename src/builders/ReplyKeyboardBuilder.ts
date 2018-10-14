import { KeyboardButton } from "../interfaces/KeyboardButton";
import { ReplyKeyboardMarkup } from "../interfaces/ReplyKeyboardMarkup";

export class ReplyKeyboardBuilder implements ReplyKeyboardMarkup {
  public keyboard: [KeyboardButton[]];
  public resize_keyboard?: boolean;
  public one_time_keyboard?: boolean;
  public selective?: boolean;

    /**
     * @class ReplyKeyboardBuilder
     * @constructor
     * @see {@link https://core.telegram.org/bots/api#replykeyboardmarkup}
     */
    constructor() {
        this.keyboard = [[]];
        this.resize_keyboard = true;
        this.one_time_keyboard = true;
        this.selective = true;
    }

    /**
     * Set `resize_keyboard` property
     * @param {boolean} resize_keyboard Requests clients to resize the keyboard vertically for optimal fit
     * @chainable
     */
    public setResizeKeyboard(resize_keyboard: boolean): ReplyKeyboardBuilder {
        this.resize_keyboard = resize_keyboard;
        return this;
    }

    /**
     * Set `one_time_keyboard` property
     * @param {boolean} one_time_keyboard Requests clients to hide the keyboard as soon as it's been used.
     * @chainable
     */
    public setOneTimeKeyboard(one_time_keyboard: boolean): ReplyKeyboardBuilder {
        this.one_time_keyboard = one_time_keyboard;
        return this;
    }

    /**
     * Set `selective` property
     * @param {boolean} selective Use this parameter if you want to show the keyboard to specific users only.
     * @chainable
     */
    public setSelective(selective: boolean): ReplyKeyboardBuilder {
        this.selective = selective;
        return this;
    }

    /**
     * Append a new row to keyboard. New buttons will be added on new row.
     * @chainable
     */
    public appendRow(): ReplyKeyboardBuilder {
        if (this._getLastRow().length > 0) {
          this.keyboard.push([]);
        }
        return this;
    }

    /**
     * Add a button to last row
     * @param {KeyboardButton} button The button object
     * @chainable
     */
    public addButton(button: KeyboardButton): ReplyKeyboardBuilder {
        this._getLastRow().push(button);
        return this;
    }

    private _getLastRow(): KeyboardButton[] {
        return this.keyboard[this.keyboard.length - 1];
    }
}
