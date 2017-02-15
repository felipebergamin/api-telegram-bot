'use strict';

class ReplyKeyboardRemove {
    /**
     * @class {ReplyKeyboardRemove}
     * @constructor
     * @see {@link https://core.telegram.org/bots/api#replykeyboardremove}
     */
    constructor () {
        this.remove_keyboard = true;
        this.selective = true;
    }
    
    /**
     * Set `remove_keyboard` property. Default is `true`
     * @param {Boolean} remove_keyboard Requests clients to remove the custom keyboard
     * @chainable
     */
    setRemoveKeyboard (remove_keyboard) {
        this.remove_keyboard = remove_keyboard;
        return this;
    }
    
    /**
     * Set `selective` property
     * @param {Boolean} selective Use this parameter if you want to remove the keyboard for specific users only. 
     * @chainable
     */
    setSelective (selective) {
        this.selective = selective;
        return this;
    }
}

module.exports = ReplyKeyboardRemove;