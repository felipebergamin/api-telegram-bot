import { IMessage } from "./IMessage";
import { ISendMessageOptionals } from "./OptionalParams/ISendMessage";

export interface IRegexCallback {
  regex: RegExp;
  callback: (
    message: IMessage,
    reply_cbk: (text: string, optionals: ISendMessageOptionals) => Promise<IMessage>,
  ) => void;
}
