import * as Debug from 'debug';

import { Bot } from '../index';
import { CallbackQuery, Message } from '../interfaces';
import { GeneratorsCleanerFn, GeneratorsHandler } from '../interfaces';
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

interface GeneratorInfo {
  id: number | string;
  startedAt: number;
  lastInteraction: number;
  fn: GeneratorFunction;
}

interface Indexes {
  [key: string]: GeneratorInfo;
}

/**
 * @param bot bot instance
 * @ignore
 */
export const handler = (bot: Bot): GeneratorsHandler => {
  const _inlineMenuGenerators: Indexes = {};
  const _textGenerators: Indexes = {};

  // tslint:disable:no-console
  setInterval(() => {
    console.log('-- keys --');
    console.log(Object.keys(_inlineMenuGenerators));
    console.log(Object.keys(_textGenerators));
  }, 5000);

  function touchGenerator(store: Indexes, index: string) {
    debug('touching generator on index: %s', index);
    store[index] = {
      ...store[index],
      lastInteraction: Date.now(),
    };
  }

  function deleteIndex(store: Indexes, index: string) {
    store[index] = null;
    delete store[index];
  }

  function storeTextGenerator(index: string, fn: GeneratorFunction, id?: number | string) {
    _textGenerators[index] = {
      fn,
      id,
      lastInteraction: Date.now(),
      startedAt: Date.now(),
    };
  }

  function storeMarkupGenerator(index: string, fn: GeneratorFunction, id?: number | string) {
    _inlineMenuGenerators[index] = {
      fn,
      id,
      lastInteraction: Date.now(),
      startedAt: Date.now(),
    };
  }

  function cleanGenerators(shouldBeRemoved: GeneratorsCleanerFn) {
    for (const key of Object.keys(_inlineMenuGenerators)) {
      const genInfo = _inlineMenuGenerators[key];

      if (shouldBeRemoved({ lastInteraction: genInfo.startedAt, startedAt: genInfo.lastInteraction, id: genInfo.id })) {
        debug(`removing index ${key} from _inlineMenuGenerators`);
        genInfo.fn.return();
        deleteIndex(_inlineMenuGenerators, key);
      }
    }

    for (const key of Object.keys(_textGenerators)) {
      const genInfo = _textGenerators[key];

      if (shouldBeRemoved({ lastInteraction: genInfo.startedAt, startedAt: genInfo.lastInteraction, id: genInfo.id })) {
        debug(`removing index ${key} from _textGenerators`);
        genInfo.fn.return();
        deleteIndex(_textGenerators, key);
      }
    }
  }

  async function startGenerator(contact_id: string | number, fn: GeneratorFunction, id?: number | string) {
    debug('starting new generator with contact: %d', contact_id);
    const { value, done } = await normalizePromise(fn.next());

    if (!isAction(value) && !isActionsArray(value)) {
      if (!done) {
        fn.throw(new Error('invalid value yielded by generator'));
      }
      return;
    }

    const firstAction = Array.isArray(value) ? value[0] : value;
    debug('generator started with %s action', firstAction.type);

    switch (firstAction.type) {
      case 'textMessage':
        try {
          const { result: sentMsg } = await bot.sendMessage(contact_id, firstAction.data.text, {
            ...firstAction.data.optionals,
            reply_markup: { force_reply: !done },
          });

          if (!done) {
            storeTextGenerator(indexForMessage(sentMsg), fn, id);
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
            storeMarkupGenerator(indexForMessage(result), fn, id);
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
      console.log( // tslint:disable-line
        '0- started: %d lastInteraction: %d',
        _textGenerators[fnIndexKey].startedAt,
        _textGenerators[fnIndexKey].lastInteraction,
      );
      touchGenerator(_textGenerators, fnIndexKey);

      const { fn, id } = _textGenerators[fnIndexKey];

      const { value, done } = await normalizePromise(fn.next(msg));
      let actions: Action[];

      if (done) {
        debug('Generator was done, removing function from index');
        deleteIndex(_textGenerators, fnIndexKey);
      }

      if (!isActionsArray(value)) {
        // here, value isn't an array of actions
        if (!isAction(value)) {
          // here, value is neither an action nor an array of actions
          if (!done) {
            // so if no action was yielded AND function isn't done, throw error
            fn.throw(new Error('invalid action yielded'));
          }
          return;
        }
        // here, value is a single action
        actions = [value];
      } else {
        actions = value;
      }

      for (const action of actions) {
        debug('received action with type: %s', action.type);

        switch (action.type) {
          case 'textMessage':
            bot.sendMessage(msg.chat.id, action.data.text, {
              ...action.data.optionals,
              reply_markup: { force_reply: !done },
              reply_to_message_id: msg.message_id,
            }).then(({ result: sentMsg }) => {
              if (!done) {
                _textGenerators[indexForMessage(sentMsg)] = _textGenerators[fnIndexKey];
              }
              delete _textGenerators[fnIndexKey];
            });
            break;

          case 'inlineMenu':
            bot.sendMessage(msg.chat.id, action.data.text, {
              reply_markup: { inline_keyboard: action.data.inline_keyboard },
              reply_to_message_id: msg.message_id,
            }).then(({ result: sentMsg }) => {
              if (!done) {
                storeMarkupGenerator(indexForMessage(sentMsg), fn, id);
              }
              delete _textGenerators[fnIndexKey];
            });
            break;

          case 'deleteMessage':
            bot.deleteMessage(msg.chat.id, msg.message_id);
            break;

          case 'switchFn':
            const newFn = action.data;
            if (!done) {
              fn.return();
            }
            storeTextGenerator(fnIndexKey, newFn, id);
            continueTextGenerator(msg);
            break;

          default:
            fn.throw(new Error('invalid action: ' + action.type));
        } // switch
      } // for
    }
  }

  async function continueKbGenerator(cbkQuery: CallbackQuery) {
    const fnIndexKey = indexForMessage(cbkQuery.message);
    debug('continue generator from inline_menu: %s', fnIndexKey);

    if (fnIndexKey in _inlineMenuGenerators) {
      touchGenerator(_inlineMenuGenerators, fnIndexKey);
      const { fn, id } = _inlineMenuGenerators[fnIndexKey];

      const { value, done } = await normalizePromise(fn.next(cbkQuery));
      let actions: Action[];

      if (done) {
        debug('generator was done, remove it from index');
        deleteIndex(_inlineMenuGenerators, fnIndexKey);
      }

      if (!isActionsArray(value)) {
        // here, value isn't an array of actions
        if (!isAction(value)) {
          // here, value is neither an action nor an array of actions
          if (!done) {
            // so if no action was yielded AND function isn't done, throw error
            fn.throw(new Error('invalid action yielded'));
          }
          return;
        }
        // here, value is a single action
        actions = [value];
      } else {
        actions = value;
      }

      for (const action of actions) {
        debug(`received action of type ${action.type}`);

        switch (action.type) {
          case 'inlineMenu':
            bot.editMessageText(action.data.text, {
              chat_id: cbkQuery.message.chat.id,
              message_id: cbkQuery.message.message_id,
              reply_markup: { inline_keyboard: action.data.inline_keyboard },
            });
            break;

          case 'answerQuery':
            bot.answerCallbackQuery(cbkQuery.id, action.data);
            break;

          case 'switchFn':
            const newFn = action.data;
            if (!done) {
              fn.return();
            }
            storeMarkupGenerator(fnIndexKey, newFn, id);
            continueKbGenerator(cbkQuery);
            break;

          case 'textMessage':
            bot.sendMessage(cbkQuery.from.id, action.data.text, {
              ...action.data.optionals,
              reply_markup: { force_reply: !done },
              reply_to_message_id: cbkQuery.message.message_id,
            }).then((sentMessage) => {
              if (!done) {
                _textGenerators[indexForMessage(sentMessage.result)] = _inlineMenuGenerators[fnIndexKey];
              }
              deleteIndex(_inlineMenuGenerators, fnIndexKey);
            });
            break;

          case 'deleteMessage':
            bot.deleteMessage(cbkQuery.message.chat.id, cbkQuery.message.message_id);
            break;

          default:
            fn.throw(new Error(`invalid action type: ${action.type}`));
        } // switch
      } // for
    }
  }

  const hasMenuForQuery = (cbkQuery: CallbackQuery) => indexForMessage(cbkQuery.message) in _inlineMenuGenerators;

  const hasHandlerForReply = (msg: Message) => indexForRepliedMsg(msg) in _textGenerators;

  return {
    cleanGenerators,
    continueKbGenerator,
    continueTextGenerator,
    hasHandlerForReply,
    hasMenuForQuery,
    startGenerator,
  };
};
