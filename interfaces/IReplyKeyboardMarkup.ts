import { IKeyboardButton as KeyboardButton } from "./IKeyboardButton";

export interface IReplyKeyboardMarkup {
  keyboard: [KeyboardButton[]];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  selective?: boolean;
}
