export interface KeyboardButton {
  /**
   * Text of the button. If none of the optional fields are used,
   * it will be sent as a message when the button is pressed
   */
  text: string;
  /**
   * Optional. If True, the user's phone number will be sent as a contact when the button is pressed.
   */
  request_contact?: boolean;
  /**
   * Optional. If True, the user's current location will be sent when the button is pressed.
   */
  request_location?: boolean;
}
