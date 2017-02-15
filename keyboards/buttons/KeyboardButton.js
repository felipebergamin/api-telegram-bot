'use strict';

class KeyboardButton {
    
    /**
     * @class {KeyboardButton}
     * @constructor
     * @see {@link https://core.telegram.org/bots/api#keyboardbutton}
     */
    constructor () { }
    
    /**
     * Set `text` property
     * @param {String} text Text of the button
     * @chainable
     */
    setText (text) {
        this.text = text;
        return this;
    }
    
    /**
     * Set `request_contact` property
     * @param {boolean} request_contact If `true`, the user's phone number will be sent as a contact when the button is pressed. Available in private chats only
     * @chainable
     */
    setRequestContact (request_contact) {
        this.request_contact = request_contact;
        return this;
    }
    
    /**
     * Set `request_location` property
     * @param {boolean} request_location If `true`, the user's current location will be sent when the button is pressed. Available in private chats only
     * @chainable
     */
    setRequestLocation (request_location) {
        this.request_location = request_location;
        return this;
    }
}

module.exports = KeyboardButton;