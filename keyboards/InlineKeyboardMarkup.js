'use strict';

const InlineKeyboardButton = require('./buttons/InlineKeyboardButton');

class InlineKeyboardMarkup {
    
    /**
     * @class {InlineKeyboardMarkup}
     * @constructor
     * @see {@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
     */
    constructor () {
        this.inline_keyboard = [];
    }
    
    /**
     * @type {InlineKeyboardButton}
     */
    static get InlineKeyboardButton () {
        return InlineKeyboardButton;
    }
    
    _getRowsCount() {
        return this.inline_keyboard.length;
    }
    
    _getLastRow() {
        if (this._getRowsCount() === 0)
            this.appendRow();
        return this.inline_keyboard[this._getRowsCount() -1];
    }
    
    /**
     * Append a new row to keyboard. New buttons will be added on new row.
     * @chainable
     */
    appendRow() {
        this.inline_keyboard.push([]);
        return this;
    }
    
    /**
     * Add a new button on last row
     * @param {InlineKeyboardButton} button The button object
     * @chainable
     */
    addButton(button) {
        this._getLastRow().push(button);
        return this;
    }
    
    /**
     * Distribute an array of Buttons in rows, respecting a limit of buttons for each row
     * @param {Array} array_btn The array of InlineKeyboardButton
     * @param {Number} [maxButtonsInRow=1] Max buttons allowed on each row
     * @chainable
     */
    distributeButtonsInRows (array_btn, maxButtonsInRow) {
        maxButtonsInRow = maxButtonsInRow || 1;
        
        array_btn.forEach(button=>{
            // se não cabem mais botões na linha atual
            if (! (this._getLastRow().length < maxButtonsInRow))
                this.appendRow();
                
            this.addButton(button);
        });
        
        return this;
    }
}

module.exports = InlineKeyboardMarkup;