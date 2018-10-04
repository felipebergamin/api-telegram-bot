import { Message } from "./Message";

export type OnReplyCallbackFunction = (m: Message) => void;

export interface OnReceiveReplyCallback {
  chat: string | number;
  message_id: string | number;
  f: (m: Message) => void;
}
