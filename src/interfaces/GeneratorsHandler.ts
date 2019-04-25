import { GeneratorFunction } from '../types';
import { CallbackQuery, Message } from './index';

export interface GeneratorsHandler {
  continueKbGenerator: (cbkquery: CallbackQuery) => Promise<void>;
  hasMenuForQuery: (cbkquery: CallbackQuery) => boolean;
  continueTextGenerator: (msg: Message) => Promise<void>;
  hasHandlerForReply: (msg: Message) => boolean;
  startGenerator: (contact_id: string | number, fn: GeneratorFunction) => Promise<void>;
}
