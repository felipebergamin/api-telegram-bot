import {
  AnswerCallbackQueryOptionals,
  InlineKeyboardMarkup,
  SendMessageOptionals,
} from '../../interfaces';
import { GeneratorFunction } from '../../types';

export type ActionType =
  'inlineMenu' | 'updateMenu' | 'answerQuery' | 'terminate' |
  'switchMenuFn' | 'textMessage';

export interface Action {
  data: any;
  type: ActionType;
}

export function inlineMenu(data: { text: string, inline_keyboard: InlineKeyboardMarkup }): Action {
  return {
    data,
    type: 'inlineMenu',
  };
}

export function updateMenu(inline_keyboard: InlineKeyboardMarkup, text?: string): Action {
  return {
    data: { inline_keyboard, text },
    type: 'updateMenu',
  };
}

export function answerQuery(data: AnswerCallbackQueryOptionals = {}): Action {
  return {
    data,
    type: 'answerQuery',
  };
}

export function terminate(text?: string): Action {
  return {
    data: { text },
    type: 'terminate',
  };
}

export function switchMenuFn(fn: GeneratorFunction) {
  return {
    data: fn,
    type: 'switchMenuFn',
  };
}

export function textMessage(text: string, optionals: SendMessageOptionals = {}) {
  return {
    data: { text, optionals },
    type: 'textMessage',
  };
}
