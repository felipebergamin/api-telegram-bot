'use strict';

const KeyboardButton = require('./buttons/KeyboardButton');

class ReplyKeyboardMarkup {
    
    /**
     * @class ReplyKeyboardMarkup
     * @constructor
     * @see {@link https://core.telegram.org/bots/api#replykeyboardmarkup}
     */
    constructor () {
        this.keyboard = [];
        this.resize_keyboard = true;
        this.one_time_keyboard = true;
        this.selective = true;
    }
    
    /**
     * @type {KeyboardButton}
     */
    static get KeyboardButton () {
        return KeyboardButton;
    }
    
    /**
     * Set `resize_keyboard` property
     * @param {boolean} resize_keyboard Requests clients to resize the keyboard vertically for optimal fit
     * @chainable
     */
    setResizeKeyboard (resize_keyboard) {
        this.resize_keyboard = resize_keyboard;
        return this;
    }
    
    /**
     * Set `one_time_keyboard` property
     * @param {boolean} one_time_keyboard Requests clients to hide the keyboard as soon as it's been used.
     * @chainable
     */
    setOneTimeKeyboard (one_time_keyboard) {
        this.one_time_keyboard = one_time_keyboard;
        return this;
    }
    
    /**
     * Set `selective` property
     * @param {boolean} selective Use this parameter if you want to show the keyboard to specific users only. 
     * @chainable
     */
    setSelective (selective) {
        this.selective = selective;
        return this;
    }
    
    /**
     * Append a new row to keyboard. New buttons will be added on new row.
     * @chainable
     */
    appendRow () {
        this.keyboard.push([]);
        return this;
    }
    
    /**
     * Add a button to last row
     * @param {KeyboardButton} button The button object
     * @chainable
     */
    addButton (button) {
        this._getLastRow().push(button);
        return this;
    }
    
    _getLastRow () {
        return this.keyboard[this.keyboard.length - 1];
    }
}

module.exports = ReplyKeyboardMarkup;