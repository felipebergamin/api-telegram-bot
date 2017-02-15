'use strict';

class InlineKeyboardButton {
    
    /**
     * @class {InlineKeyboardButton}
     * @constructor
     * @see {@link https://core.telegram.org/bots/api#inlinekeyboardbutton}
     */
    constructor () { }
    
    /**
     * Set `text` property
     * @param {String} text Label text on the button
     * @chainable
     */
    setText (text) {
        this.text = text;
        return this;
    }
    
    /**
     * Set `url` property
     * @param {String} url HTTP url to be opened when button is pressed
     * @chainable
     */
    setUrl (url) {
        this.url = url;
        return this;
    }
    
    /**
     * Set `callback_data` property
     * @param {String} callback_data Data to be sent in a `callback_query` to the bot when button is pressed, 1-64 bytes
     * @chainable
     */
    setCallbackData (callback_data) {
        this.callback_data = callback_data;
        return this;
    }
    
    /**
     * Set `switch_inline_query` property
     * @param {String} switch_inline_query If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s username and the specified inline query in the input field.
     * @chainable
     */
    setSwitchInlineQuery (switch_inline_query) {
        this.switch_inline_query = switch_inline_query;
        return this;
    }
    
    /**
     * Set `switch_inline_query_current_chat` property
     * @param {String} switch_inline_query_current_chat If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's input field.
     * @chainable
     */
    setSwitchInlineQueryCurrentChat (switch_inline_query_current_chat) {
        this.switch_inline_query_current_chat = switch_inline_query_current_chat;
        return this;
    }
    
    /**
     * Set `callback_game` property
     * @param {Object} callback_game Description of the game that will be launched when the user presses the button.
     * @chainable
     */
    setCallbackGame (callback_game) {
        this.callback_game = callback_game;
        return this;
    }
}

module.exports = InlineKeyboardButton;