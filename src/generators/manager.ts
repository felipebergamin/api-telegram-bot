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
            reply_markup: { force_reply: !done },
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

      const { value, done } = await normalizePromise(fn.next(msg));
      let actions: Action[];

      if (done) {
        debug('Generator was done, removing function from index');
        delete _textGenerators[fnIndexKey];
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
                _inlineMenuGenerators[indexForMessage(sentMsg)] = fn;
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
            _textGenerators[fnIndexKey] = newFn;
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
      const fn = _inlineMenuGenerators[fnIndexKey];

      const { value, done } = await normalizePromise(fn.next(cbkQuery));
      let actions: Action[];

      if (done) {
        debug('generator was done, remove it from index');
        delete _inlineMenuGenerators[fnIndexKey];
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
            _inlineMenuGenerators[fnIndexKey] = newFn;
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
              delete _inlineMenuGenerators[fnIndexKey];
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

  const hasMenuForQuery = (cbkQuery: CallbackQuery) => {
    debug('hasMenuForQuery: ' + indexForMessage(cbkQuery.message));
    return indexForMessage(cbkQuery.message) in _inlineMenuGenerators;
  };

  const hasHandlerForReply = (msg: Message) => {
    debug('hasHandlerForReply: ', indexForRepliedMsg(msg));
    return indexForRepliedMsg(msg) in _textGenerators;
  };

  return {
    continueKbGenerator,
    continueTextGenerator,
    hasHandlerForReply,
    hasMenuForQuery,
    startGenerator,
  };
};
