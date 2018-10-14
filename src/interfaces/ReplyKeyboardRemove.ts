export interface ReplyKeyboardRemove {
  /** Requests clients to remove the custom keyboard */
  remove_keyboard: boolean;
  /** Use this parameter if you want to remove the keyboard for specific users only. */
  selective?: boolean;
}
