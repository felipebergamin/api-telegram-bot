import { AnswerCallbackQueryOptionals, InlineKeyboardMarkup } from '../../interfaces';
import { InlineMenuFunction } from '../manager';

export type ActionType = 'inlineMenu' | 'updateText' | 'updateMarkup' | 'answerQuery' | 'terminate' | 'switchMenuFn';

export interface Action {
  data: any;
  type: ActionType;
}

export function isAction(val: any): val is Action {
  return typeof val === 'object' && val.data && val.type;
}

export function isActionsArray(val: any): val is Action[] {
  return Array.isArray(val) && val.every(isAction);
}

export function inlineMenu(data: { text: string, inline_keyboard: InlineKeyboardMarkup }): Action {
  return {
    data,
    type: 'inlineMenu',
  };
}

export function updateText(text: string): Action {
  return {
    data: { text },
    type: 'updateText',
  };
}

export function updateMarkup(inline_keyboard: InlineKeyboardMarkup): Action {
  return {
    data: { inline_keyboard },
    type: 'updateMarkup',
  };
}

export function answerQuery(data: AnswerCallbackQueryOptionals = {}): Action {
  return {
    data,
    type: 'answerQuery',
  };
}

export function terminate(): Action {
  return {
    data: {},
    type: 'terminate',
  };
}

export function switchMenuFn(fn: InlineMenuFunction) {
  return {
    data: fn,
    type: 'switchMenuFn',
  };
}
