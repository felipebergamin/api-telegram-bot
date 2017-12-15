import { IMessage as Message } from "./IMessage";
import { IUser as User } from "./IUser";

export interface ICallbackQuery {
  id: string;
  from: User;
  message?: Message;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}
