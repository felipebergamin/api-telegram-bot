import * as Debug from 'debug';
import { isNullOrUndefined } from 'util';

import { Bot } from '../index';
import { CallbackQuery, Message } from '../interfaces';
import { GeneratorsHandler } from '../interfaces';
import { GeneratorFunction } from '../types';
import { Action } from './actions';
import {
  indexForMessage,
  indexForRepliedMsg,
  isAction,
  isActionsArray,
  normalizePromise,
} from './utils';

const debug = Debug('api-telegram-bot:generators');

interface Indexes {
  [key: string]: GeneratorFunction;
}

/**
 * @param bot bot instance
 * @ignore
 */
export const handler = (bot: Bot): GeneratorsHandler => {
  const _inlineMenuGenerators: Indexes = {};
  const _textGenerators: Indexes = {};

  /**
   * receive a chat_id and a generator function to start a interaction managed by generator
   * @param to contact id to send messages from generator
   * @param fn generator function
   * @ignore
   */
  async function startTextGenerator(to: string | number, fn: GeneratorFunction) {
    const { value } = await normalizePromise(fn.next());

    const firstAction = Array.isArray(value) ? value[0] : value;

    if (!isAction(firstAction) || firstAction.type !== 'textMessage') {
      fn.throw(new Error('invalid action received'));
      return;
    }

    try {
      const { result: sentMsg } = await bot.sendMessage(to, firstAction.data.text, {
        ...firstAction.data.optionals,
        reply_markup: { force_reply: true },
      });
      _textGenerators[indexForMessage(sentMsg)] = fn;
    } catch (err) {
      fn.throw(err);
    }
  }

  /**
   * receive a message and continue generator
   * @param msg message received
   */
  async function continueTextGenerator(msg: Message) {
    const fnIndexKey = indexForRepliedMsg(msg);
    debug('continue generator for message %s on chat %s', msg.message_id, msg.chat.id);

    if (fnIndexKey in _textGenerators) {
      const fn = _textGenerators[fnIndexKey];

      let { value: actions } = await normalizePromise(fn.next(msg));

      if (!Array.isArray(actions)) {
        actions = [actions];
      }

      if (!actions.every(isAction)) {
        fn.throw(new Error('invalid action received from generator'));
        return;
      }

      for (const action of actions) {
        debug('received action with type: %s', action.type);
        switch (action.type) {
          case 'textMessage':
            bot.sendMessage(msg.chat.id, action.data.text, {
              ...action.data.optionals,
              reply_markup: { force_reply: true },
              reply_to_message_id: msg.message_id,
            }).then(({ result: sentMsg }) => {
              const newIndex = indexForMessage(sentMsg);
              _textGenerators[newIndex] = _textGenerators[fnIndexKey];
              delete _textGenerators[fnIndexKey];
            });
            break;
          case 'inlineMenu':
            bot.sendMessage(msg.chat.id, action.data.text, {
              reply_markup: { inline_keyboard: action.data.inline_keyboard },
            }).then(({ result: sentMsg }) => {
              _inlineMenuGenerators[indexForMessage(sentMsg)] = fn;
              delete _textGenerators[fnIndexKey];
            });
            break;
          case 'terminate':
            if (action.data.text) {
              bot.sendMessage(msg.chat.id, action.data.text, {
                reply_to_message_id: msg.message_id,
              });
            }
            fn.return();
            delete _textGenerators[fnIndexKey];
            break;
          default:
            fn.throw(new Error('invalid action: ' + action.type));
        }
      }
    }
  }

  async function startInlineKbGenerator(to: string | number, fn: GeneratorFunction) {
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
      _inlineMenuGenerators[indexForMessage(result)] = fn;
    } catch (err) {
      fn.throw(err);
    }
  }

  async function continueKbGenerator(cbkQuery: CallbackQuery) {
    const fnIndexKey = indexForMessage(cbkQuery.message);
    debug('continue generator from inline_menu: %s', fnIndexKey);

    if (fnIndexKey in _inlineMenuGenerators) {
      const fn = _inlineMenuGenerators[fnIndexKey];

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
          case 'updateMenu':
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
            bot.answerCallbackQuery(cbkQuery.id, data);
            break;
          case 'switchMenuFn':
            const newFn = data;
            fn.return();
            _inlineMenuGenerators[indexForMessage(cbkQuery.message)] = newFn;
            continueKbGenerator(cbkQuery);
            break;
          case 'textMessage':
            bot.sendMessage(cbkQuery.from.id, data.text, {
              ...data.optionals,
              reply_markup: { force_reply: true },
            }).then((sentMessage) => {
              _textGenerators[indexForMessage(sentMessage.result)] = _inlineMenuGenerators[fnIndexKey];
              delete _inlineMenuGenerators[fnIndexKey];
            });
            break;
          case 'terminate':
            if (data.text) {
              bot.editMessageText(data.text, {
                chat_id: cbkQuery.message.chat.id,
                message_id: cbkQuery.message.message_id,
              });
            }
            fn.return();
            delete _inlineMenuGenerators[fnIndexKey];
            break;
          default:
            fn.throw(new Error(`invalid action type: ${type}`));
        }
      }

      if (done) {
        delete _inlineMenuGenerators[fnIndexKey];
      }
    }
  }

  const hasMenuForQuery = (cbkQuery: CallbackQuery) => (indexForMessage(cbkQuery.message) in _inlineMenuGenerators);

  const hasHandlerForReply = (msg: Message) => (indexForRepliedMsg(msg) in _textGenerators);

  return {
    continueKbGenerator,
    continueTextGenerator,
    hasHandlerForReply,
    hasMenuForQuery,
    startInlineKbGenerator,
    startTextGenerator,
  };
};
