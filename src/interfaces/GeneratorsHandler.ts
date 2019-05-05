import { GeneratorFunction } from '../types';
import { CallbackQuery, Message } from './index';

export type GeneratorsCleanerFn =
  (data: { lastInteraction: number, startedAt: number, id: string | number }) => boolean;

export interface GeneratorsHandler {
  cleanGenerators: (cbk: GeneratorsCleanerFn) => void;
  continueKbGenerator: (cbkquery: CallbackQuery) => Promise<void>;
  hasMenuForQuery: (cbkquery: CallbackQuery) => boolean;
  continueTextGenerator: (msg: Message) => Promise<void>;
  hasHandlerForReply: (msg: Message) => boolean;
  startGenerator: (contact_id: string | number, fn: GeneratorFunction, id?: number | string) => Promise<void>;
}
