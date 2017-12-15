import { IMessage } from "./IMessage";
import { IMessageActions as MessageActions } from "./IMessageActions";
import { ISendMessageOptionals } from "./OptionalParams/ISendMessage";

export interface IRegexCallback {
  regex: RegExp;
  callback: (
    message: IMessage,
    actions: MessageActions,
  ) => void;
}
