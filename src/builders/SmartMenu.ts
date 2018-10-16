import { randomBytes } from "crypto";
import { isFunction } from "util";

import { Bot } from "../Bot";
import { debug } from "../debug";
import { CallbackQuery, InlineKeyboardButton } from "../interfaces";

export type InlineKeyboardButtonFunction = (callbackQuery: CallbackQuery, killMenu: (message: string) => void) => any;

/**
 * Note: SmartMenu is a imature and experimental feature,
 * if it don't work properly, open a issue on GitHub
 * @beta
 */
export class SmartMenu {
  /** chat identifier where this menu was sent, used to match callback_queries */
  public chat_id;
  /** sent message identifier, used to match callback_queries */
  public message_id;

  /** reference to parent menu, used to "back button" know where to back */
  private previousMenuRef: SmartMenu;
  /** keyboard markup sent to telegram api */
  private keyboard: [InlineKeyboardButton[]];
  /** array associating callback_data attribute to function to call */
  private callbacksFunctions: [[string, InlineKeyboardButtonFunction]?] = [];
  /** flag to avoid multiple "back button's" when browsing */
  private backButtonAlreadyAdded: boolean;

  /**
   * @param title title to show with menu
   * @param showBackButton true if a "back to parent menu" button must be added
   * @param backButtonText optional, back button text. Default: `Back`
   * @constructor
   */
  constructor(public title: string, public showBackButton: boolean = false, public backButtonText: string = "Back") {
    this.keyboard = [[]];
  }

  /**
   * get inline_keyboard markup to send telegram api
   * add back button at end of keyboard if `showBackButton` is true
   * @returns inline_keyboard object
   */
  public get inline_keyboard(): [InlineKeyboardButton[]] {
    debug(`showBackButton: ${this.showBackButton} \t previousMenuReference: ${this.previousMenuRef}`);
    if (this.showBackButton && this.previousMenuRef && !this.backButtonAlreadyAdded) {
      debug("appending back button to menu");
      this.appendRow()
        .addButton(this.backButtonText, () => this.previousMenuRef);
      this.backButtonAlreadyAdded = true;
    }

    return this.keyboard;
  }

  /**
   * add a new button to keyboard with a function to be called when button is pressed
   * @param button button label
   * @param fn function that must be called
   * @chainable
   */
  public addButton(buttonLabel: string, fn: InlineKeyboardButtonFunction = null): SmartMenu {
    const button = this._createButton(buttonLabel);

    if (isFunction(fn)) {
      if (!button.callback_data) {
        throw new Error("button functions can only be used with callback_data attribute");
      }

      this.callbacksFunctions.push([button.callback_data, fn]);
    }

    this.getLastRow().push(button);
    return this;
  }

  /**
   * start a new row on keyboard markup
   * new buttons will be added on new row
   * @chainable
   */
  public appendRow(): SmartMenu {
    if (this.getLastRow().length > 0) {
      this.keyboard.push([]);
    }
    return this;
  }

  /**
   * check if a callback_query update belongs to this keyboard
   * @param cbQuery the received callback_query update
   * @returns `true` if matches, `false` if not
   * @ignore
   */
  public checkCallbackQueryUpdate(cbQuery: CallbackQuery) {
    return cbQuery && cbQuery.message.message_id === this.message_id && cbQuery.message.chat.id === this.chat_id;
  }

  /**
   * received a `callback_query` update and call a function if matches
   * @param cbQuery callback_query update
   * @param bot bot instance
   * @param kill function called when menu ends interation
   * @returns same returned by button function, null if callback_query does't belong to this keyboard
   * @ignore
   */
  public async run(cbQuery: CallbackQuery, bot: Bot, kill: () => void) {
    // check if callback_query was triggered by this menu
    if (!this.checkCallbackQueryUpdate(cbQuery)) {
      return false;
    }

    const receivedData = cbQuery.data;
    for (const [expectedData, fn] of this.callbacksFunctions) {
      // when found button tapped on client
      if (receivedData === expectedData) {
        const killMenu = (message) => {
          kill();
          bot.editMessageText(message,
            { chat_id: this.chat_id, message_id: this.message_id });
        };

        let result = fn(cbQuery, killMenu);

        // if returned a promise, resolve it before continue
        /* TODO: improve promise check */
        if (result && result.then) {
          result = await result;
        }

        const chat_id = cbQuery.message.chat.id;
        const message_id = cbQuery.message.message_id;

        /**
         * if returned a new instance of SmartMenu,
         * the message on client must be updated with new text and markup
         */
        if (result instanceof SmartMenu) {
          /*
          only set the back button reference if no reference was added yet
          this avoid problems with multi-level menu

          example 3 levels menu: RootMenu -> ChildMenu_1 -> ChildMenu2

          when browsing to ChildMenu2 and try back to RootMenu,
          the back button on ChildMenu_1 will reference ChildMenu_2
          and the user will never come back to RootMenu
           */
          if (result.showBackButton && !result.previousMenuRef) {
            result.previousMenuRef = this;
          }

          // avoid loading icon when browsing to a child menu and then back
          bot.answerCallbackQuery(cbQuery.id);
          // update menu text and markup
          bot.editMessageText(result.title,
            { chat_id, message_id, reply_markup: { inline_keyboard: result.inline_keyboard } });

          // set message and chat id's on new menu
          result.message_id = this.message_id;
          result.chat_id = this.chat_id;

        }
        return result;
      }
    }

    return null;
  }

  /** return keyboard rows count */
  private getRowsCount(): number {
    return this.keyboard.length;
  }

  /** return last row reference */
  private getLastRow() {
    if (this.getRowsCount() === 0) {
      this.appendRow();
    }
    return this.keyboard[this.getRowsCount() - 1];
  }

  private _createButton(label: string): InlineKeyboardButton {
    return {
      callback_data: `SMRTMENU${randomBytes(5).toString("hex")}`,
      text: label,
    };
  }
}
