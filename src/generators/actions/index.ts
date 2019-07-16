import {
  AnswerCallbackQueryOptionals,
  InlineKeyboardButton,
  SendMessageOptionals,
} from '../../interfaces';
import { GeneratorFunction } from '../../types';

export type ActionType =
  'inlineMenu' | 'answerQuery' |
  'switchFn' | 'textMessage' | 'deleteMessage';

export interface Action {
  data: any;
  type: ActionType;
}

export function deleteMessage(): Action {
  return {
    data: {},
    type: 'deleteMessage',
  };
}

export function inlineMenu(data: { text: string, inline_keyboard: InlineKeyboardButton[][] }): Action {
  return {
    data,
    type: 'inlineMenu',
  };
}

export function answerQuery(data: AnswerCallbackQueryOptionals = {}): Action {
  return {
    data,
    type: 'answerQuery',
  };
}

export function switchFn(fn: GeneratorFunction): Action {
  return {
    data: fn,
    type: 'switchFn',
  };
}

export function textMessage(text: string, optionals: SendMessageOptionals = {}): Action {
  return {
    data: { text, optionals },
    type: 'textMessage',
  };
}

export const GeneratorActions = {
  answerQuery,
  deleteMessage,
  inlineMenu,
  switchFn,
  textMessage,
};
