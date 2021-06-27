import { OnReplyCallbackFunction } from '../types';

export interface OnReceiveReplyCallback {
  /**
   * chat id when original message was sent
   */
  chat: string | number;
  /**
   * id of message that will be replied
   */
  message_id: string | number;
  /**
   * function to be called when receive reply
   */
  f: OnReplyCallbackFunction;

  data?: any;
}
