import { Message, MessageActions } from "../interfaces";

/**
 * @param m received message object
 * @param a object with helper functions
 */
export type OnReplyCallbackFunction = (m: Message, a: MessageActions, data?: any) => void;
