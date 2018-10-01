import { Message } from "./Message";
import { SendMessageOptionals } from "./OptionalParams/SendMessage";
import { TelegramResponse } from "./TelegramResponse";

export interface MessageActions {
  banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>;
  deleteMessage?: () => Promise<TelegramResponse<boolean>>;
  reply: (text: string, optionals?: SendMessageOptionals) => Promise<TelegramResponse<Message>>;
}
