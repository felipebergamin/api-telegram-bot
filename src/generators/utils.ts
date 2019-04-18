import { isFunction } from 'util';

import { Message } from '../interfaces';
import { Action } from './actions';

export function isAction(val: any): val is Action {
  return typeof val === 'object' && val.data && val.type;
}

export function isActionsArray(val: any): val is Action[] {
  return Array.isArray(val) && val.every(isAction);
}

export function indexForMessage(msg: Message): string {
  return `${msg.message_id}_${msg.chat.id}`;
}

export function indexForRepliedMsg(msg: Message): string {
  return `${msg.reply_to_message.message_id}_${msg.chat.id}`;
}

export async function normalizePromise(p: any): Promise<IteratorResult<Action | Action[]>> {
  return (
    'then' in p && isFunction(p.then)
      ? await p
      : p
  );
}
