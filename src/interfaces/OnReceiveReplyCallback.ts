import { Message, MessageActions } from "./index";

export type OnReplyCallbackFunction = (m: Message, a: MessageActions) => void;

export interface OnReceiveReplyCallback {
  chat: string | number;
  message_id: string | number;
  f: OnReplyCallbackFunction;
}
