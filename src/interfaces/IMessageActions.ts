import { IMessage as Message } from "./IMessage";
import { ISendMessageOptionals } from "./OptionalParams/ISendMessage";

export interface IMessageActions {
  banChatMember?: (until: number) => Promise<boolean>;
  deleteMessage?: () => Promise<boolean>;
  reply: (text: string, optionals?: ISendMessageOptionals) => Promise<Message>;
}
