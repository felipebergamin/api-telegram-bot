import { GeneratorFunction } from '../types';
import { CallbackQuery, Message } from './index';

export interface GeneratorsHandler {
  startInlineKbGenerator: (to: string | number, fn: GeneratorFunction) => Promise<void>;
  continueKbGenerator: (cbkquery: CallbackQuery) => Promise<void>;
  hasMenuForQuery: (cbkquery: CallbackQuery) => boolean;
  continueTextGenerator: (msg: Message) => Promise<void>;
  hasHandlerForReply: (msg: Message) => boolean;
  startTextGenerator: (to: string | number, fn: GeneratorFunction) => Promise<void>;
}
