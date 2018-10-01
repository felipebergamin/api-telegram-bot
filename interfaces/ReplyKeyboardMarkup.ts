import { KeyboardButton } from "./KeyboardButton";

export interface ReplyKeyboardMarkup {
  keyboard: [KeyboardButton[]];
  resize_keyboard?: boolean;
  one_time_keyboard?: boolean;
  selective?: boolean;
}
