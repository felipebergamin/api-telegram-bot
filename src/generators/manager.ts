import * as Debug from 'debug';

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

  async function startGenerator(contact_id: string | number, fn: GeneratorFunction) {
    const { value, done } = await normalizePromise(fn.next());

    if (!isAction(value) && !isActionsArray(value)) {
      if (!done) {
        fn.throw(new Error('invalid value yielded by generator'));
      }
      return;
    }

    const firstAction = Array.isArray(value) ? value[0] : value;

    switch (firstAction.type) {
      case 'textMessage':
        try {
          const { result: sentMsg } = await bot.sendMessage(contact_id, firstAction.data.text, {
            ...firstAction.data.optionals,
            reply_markup: { force_reply: true },
          });

          if (!done) {
            _textGenerators[indexForMessage(sentMsg)] = fn;
          }
        } catch (err) {
          fn.throw(err);
        }
        break;
      case 'inlineMenu':
        try {
          const { text, inline_keyboard } = firstAction.data;
          const { result } = await bot.sendMessage(
            contact_id,
            text,
            {
              reply_markup: {
                inline_keyboard,
              },
            },
          );

          if (!done) {
            _inlineMenuGenerators[indexForMessage(result)] = fn;
          }
        } catch (err) {
          fn.throw(err);
        }
        break;
      default:
        fn.throw(new Error('invalid action type received: ' + firstAction.type));
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
            typeof data.text === 'string'
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
    startGenerator,
  };
};
