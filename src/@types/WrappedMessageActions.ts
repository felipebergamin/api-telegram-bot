import type { MessageActions } from './Args/MessageActions';
import type Update from './Entities/Update';

export default interface WrappedMessageActions {
  update: Update;
  actions: MessageActions | null;
}
