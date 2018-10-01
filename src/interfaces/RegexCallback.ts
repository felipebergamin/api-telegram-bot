import { Message } from "./Message";
import { MessageActions } from "./MessageActions";

export interface RegexCallback {
  regex: RegExp;
  callback: (
    message: Message,
    actions: MessageActions,
  ) => void;
}
