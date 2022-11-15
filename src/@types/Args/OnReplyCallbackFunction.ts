import type Message from '../Entities/Message';
import type { MessageActions } from './MessageActions';

/**
 * @param m received message object
 * @param a object with helper functions
 */
type OnReplyCallbackFunction = (
  m: Message,
  a: MessageActions,
  data?: any
) => void;

export default OnReplyCallbackFunction;
