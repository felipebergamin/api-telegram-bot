import type CallbackQuery from './CallbackQuery';
import type CallbackQueryActions from './CallbackQueryActions';

export type CallbackQueryHandlerFunction = (
  cbkQuery: CallbackQuery,
  actions: CallbackQueryActions,
  data?: any,
) => void;

export interface CallbackQueryHandler {
  message_id: number;
  chat_id: number;
  f: CallbackQueryHandlerFunction;
  data?: any;
}
