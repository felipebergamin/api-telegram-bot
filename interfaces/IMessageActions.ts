import { IMessage as Message } from "./IMessage";
import { ITelegramResponse as TelegramResponse } from "./ITelegramResponse";
import { ISendMessageOptionals } from "./OptionalParams/ISendMessage";

export interface IMessageActions {
  banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>;
  deleteMessage?: () => Promise<TelegramResponse<boolean>>;
  reply: (text: string, optionals?: ISendMessageOptionals) => Promise<TelegramResponse<Message>>;
}
