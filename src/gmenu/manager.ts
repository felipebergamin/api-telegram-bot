import { isFunction, isNullOrUndefined } from 'util';

import { debug } from '../debug';
import { Bot } from '../index';
import {
  CallbackQuery,
  Message,
} from '../interfaces';
import { Action, isAction, isActionsArray } from './actions';

function indexKey(msg: Message): string {
  return `${msg.message_id}_${msg.chat.id}`;
}

export type InlineMenuFunction = IterableIterator<Action|Action[]> | AsyncIterableIterator<Action|Action[]>;

export interface InlineMenuManager {
  sendMenu: (to: string|number, fn: InlineMenuFunction) => void;
  continueMenu: (cbkquery: CallbackQuery) => void;
  hasMenuForQuery: (cbkquery: CallbackQuery) => boolean;
}

export interface Indexes {
  [key: string]: InlineMenuFunction;
}

async function normalizePromise(p: any): Promise<IteratorResult<Action | Action[]>> {
  return (
    'then' in p && isFunction(p.then)
      ? await p
      : p
  );
}

export const handler = (bot: Bot): InlineMenuManager => {
  const handlers: Indexes = {};

  async function sendMenu(to: string | number, fn: InlineMenuFunction) {
    const ret = await normalizePromise(fn.next());

    if (isNullOrUndefined(ret.value)) {
      throw new Error('No action yielded by generator');
    }

    const action = isActionsArray(ret.value) ? ret.value[0] : ret.value;

    if (!isAction(action)) {
      throw new Error('yielded value isn\'t an action');
    }

    const { data, type } = action;

    if (!type || type !== 'inlineMenu') {
      fn.return();
      throw new Error('first action must me inlineMenu');
    }

    const { text, inline_keyboard } = data;

    if (isNullOrUndefined(text) || isNullOrUndefined(inline_keyboard)) {
      fn.return();
      throw new Error('undefined text or inline_keyboard');
    }

    try {
      const { result } = await bot.sendMessage(to, text, { reply_markup: { inline_keyboard } });
      handlers[indexKey(result)] = fn;
    } catch (err) {
      fn.throw(err);
    }
  }

  async function continueMenu(cbkQuery: CallbackQuery) {
    const fnIndexKey = indexKey(cbkQuery.message);

    if (fnIndexKey in handlers) {
      const fn = handlers[fnIndexKey];

      const { value, done } = await normalizePromise(fn.next(cbkQuery));
      let actions = value;

      const isArray = (val: any): val is Action[] => Array.isArray(val);

      if (!isArray(actions)) {
        actions = [actions];
      }

      for (const action of actions) {
        const { data, type } = action;
        debug(`received action of type ${type}`);

        switch (type) {
          case 'inlineMenu':
            bot.editMessageText(data.text, {
              chat_id: cbkQuery.message.chat.id,
              message_id: cbkQuery.message.message_id,
              reply_markup: { inline_keyboard: data.inline_keyboard },
            });
            break;
          case 'updateText':
            bot.editMessageText(data.text, {
              chat_id: cbkQuery.message.chat.id,
              message_id: cbkQuery.message.message_id,
            });
            break;
          case 'updateMarkup':
            bot.editMessageReplyMarkup({
              chat_id: cbkQuery.message.chat.id,
              message_id: cbkQuery.message.message_id,
              reply_markup: { inline_keyboard: data.inline_keyboard },
            });
            break;
          case 'answerQuery':
            bot.answerCallbackQuery(cbkQuery.id, data);
            break;
          case 'switchMenuFn':
            const newFn = data;
            fn.return();
            handlers[indexKey(cbkQuery.message)] = newFn;
            continueMenu(cbkQuery);
            break;
          case 'terminate':
            fn.return();
            delete handlers[fnIndexKey];
            break;
          default:
          fn.throw(new Error(`invalid action type: ${type}`));
        }
      }

      if (done) {
        delete handlers[fnIndexKey];
      }
    }
  }

  const hasMenuForQuery = (cbkQuery: CallbackQuery) => (indexKey(cbkQuery.message) in handlers);

  return {
    continueMenu,
    hasMenuForQuery,
    sendMenu,
  };
};
