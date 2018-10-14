import { MessageActions } from "./MessageActions";
import { Update } from "./Update";

export interface WrappedMessageActions {
  update: Update;
  actions: MessageActions;
}
