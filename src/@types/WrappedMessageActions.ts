import type { Update } from './generated';
import type { MessageActions } from './MessageActions';

export default interface WrappedMessageActions {
  update: Update;
  actions: MessageActions;
}
