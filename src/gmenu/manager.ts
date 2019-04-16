import { isFunction, isNullOrUndefined } from 'util';

import * as Debug from 'debug';
import { Bot } from '../index';
import {
  CallbackQuery,
  Message,
} from '../interfaces';
import { Action, isAction, isActionsArray } from './actions';

const debug = Debug('api-telegram-bot:generators');

function indexKey(msg: Message): string {
  return `${msg.message_id}_${msg.chat.id}`;
}

function indexForReply(msg: Message): string {
  return `${msg.reply_to_message.message_id}_${msg.chat.id}`;
}

export type InlineMenuFunction = IterableIterator<Action | Action[]> | AsyncIterableIterator<Action | Action[]>;

export interface InlineMenuManager {
  sendMenu: (to: string | number, fn: InlineMenuFunction) => void;
  continueMenu: (cbkquery: CallbackQuery) => void;
  hasMenuForQuery: (cbkquery: CallbackQuery) => boolean;
  continueTextFn: (msg: Message) => void;
  hasHandlerForReply: (msg: Message) => boolean;
  startTextGenerator: (to: string | number, fn: InlineMenuFunction) => void;
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
  const replyHandlers: Indexes = {};

  async function startTextGenerator(to: string | number, fn: InlineMenuFunction) {
    const { value } = await normalizePromise(fn.next());

    const firstAction = Array.isArray(value) ? value[0] : value;

    if (!isAction(firstAction) || firstAction.type !== 'textMessage') {
      fn.throw(new Error('invalid action received'));
      return;
    }

    try {
      const { result } = await bot.sendMessage(to, firstAction.data.text, {
        ...firstAction.data.optionals,
        reply_markup: { force_reply: true },
      });
      replyHandlers[indexKey(result)] = fn;
    } catch (err) {
      fn.throw(err);
    }
  }

  async function continueTextFn(msg: Message) {
    const fnIndexKey = indexForReply(msg);
    debug(`continue generator from text: ${fnIndexKey}`);

    if (fnIndexKey in replyHandlers) {
      const fn = replyHandlers[fnIndexKey];

      const { value } = await normalizePromise(fn.next(msg));

      let actions = value;

      if (!Array.isArray(actions)) {
        actions = [actions];
      }

      for (const action of actions) {
        debug('received action with type: %s', action.type);
        switch (action.type) {
          case 'textMessage':
            bot.sendMessage(msg.chat.id, action.data.text, {
              ...action.data.optionals,
              reply_markup: { force_reply: true },
              reply_to_message_id: msg.message_id,
            }).then((sentMessage) => {
              const newIndex = indexKey(sentMessage.result);
              replyHandlers[newIndex] = replyHandlers[fnIndexKey];
              delete replyHandlers[fnIndexKey];
            });
            break;
          case 'inlineMenu':
            bot.sendMessage(msg.chat.id, action.data.text, {
              reply_markup: { inline_keyboard: action.data.inline_keyboard },
            }).then((sentMsg) => {
              handlers[indexKey(sentMsg.result)] = fn;
              delete replyHandlers[fnIndexKey];
            });
            break;
          case 'terminate':
            if (action.data.text) {
              bot.sendMessage(msg.chat.id, action.data.text, {
                reply_to_message_id: msg.message_id,
              });
            }
            fn.return();
            delete replyHandlers[fnIndexKey];
            break;
          default:
            fn.throw(new Error('invalid action: ' + action.type));
        }
      }
    }
  }

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
    debug('continue generator from inline_menu: %s', fnIndexKey);

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
            debug('executing inlineMenu action');
            bot.editMessageText(data.text, {
              chat_id: cbkQuery.message.chat.id,
              message_id: cbkQuery.message.message_id,
              reply_markup: { inline_keyboard: data.inline_keyboard },
            });
            break;
          case 'updateMenu':
            debug('executing updateMenu action');
            data.text
              ? bot.editMessageText(data.text, {
                chat_id: cbkQuery.message.chat.id,
                message_id: cbkQuery.message.message_id,
                reply_markup: { inline_keyboard: data.inline_keyboard },
              })
              : bot.editMessageReplyMarkup({
                chat_id: cbkQuery.message.chat.id,
                message_id: cbkQuery.message.message_id,
                reply_markup: { inline_keyboard: data.inline_keyboard },
              });
            break;
          case 'answerQuery':
            debug('executing answerQuery action');
            bot.answerCallbackQuery(cbkQuery.id, data);
            break;
          case 'switchMenuFn':
            debug('executing switchMenuFn action');
            const newFn = data;
            fn.return();
            handlers[indexKey(cbkQuery.message)] = newFn;
            continueMenu(cbkQuery);
            break;
          case 'textMessage':
            debug('executing textMessage action');
            bot.sendMessage(cbkQuery.from.id, data.text, {
              ...data.optionals,
              reply_markup: { force_reply: true },
            }).then((sentMessage) => {
              replyHandlers[indexKey(sentMessage.result)] = handlers[fnIndexKey];
              delete handlers[fnIndexKey];
            });
            break;
          case 'terminate':
            debug('executing terminate action');
            if (data.text) {
              bot.editMessageText(data.text, {
                chat_id: cbkQuery.message.chat.id,
                message_id: cbkQuery.message.message_id,
              });
            }
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

  const hasHandlerForReply = (msg: Message) => (indexForReply(msg) in replyHandlers);

  return {
    continueMenu,
    continueTextFn,
    hasHandlerForReply,
    hasMenuForQuery,
    sendMenu,
    startTextGenerator,
  };
};
