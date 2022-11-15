import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import type { AxiosInstance } from 'axios';
import axios from 'axios';

import FormData from 'form-data';
import { ReadStream } from 'fs';

import type { Polling } from './Polling';

import Webhook from './Webhook';
import { createMessageActions } from './utils';
import type { ApiMethods } from './@types';
import type TelegramResponse from './@types/Entities/TelegramResponse';
import type Update from './@types/Entities/Update';
import type WrappedMessageActions from './@types/WrappedMessageActions';
import type MessageType from './@types/MessageType';
import type UpdateType from './@types/UpdateType';

export default class Bot {
  #updates: Subject<Update>;

  #webhook: Webhook | null = null;

  #polling: Polling | null;

  #axios: AxiosInstance;

  /**
   * Constructs bot client
   *
   * @constructor
   * @param bot_token Bot token
   * @param config Optional config object.
   */
  constructor(private bot_token: string) {
    if (!bot_token) {
      throw new Error('bot token undefined');
    }
    this.#updates = new Subject();
    this.#polling = null;
    this.#axios = axios.create({
      baseURL: `https://api.telegram.org/bot${bot_token}`,
    });
  }

  /** @ignore */
  public linkToWebhook(webhook: Webhook) {
    if (this.#webhook) {
      throw new Error(
        'Trying to set a webhook reference, but another webhook was set',
      );
    }
    this.configObservables(webhook.updates);
    this.#webhook = webhook;
  }

  public setPolling(polling: Polling) {
    if (this.#polling && this.#polling.isPolling) {
      this.#polling.stopPolling();
    }

    this.configObservables(polling.updates);
    this.#polling = polling;
  }

  /** @return Polling instance reference */
  public getPolling() {
    return this.#polling;
  }

  /**
   * create a webhook to receive updates
   * returns a request handler function to be used with express or node http
   * @return http request handler
   */
  public getWebhook() {
    const wh = new Webhook(this);
    return wh.getWebhook();
  }

  /**
   * Subscribe specific types of update.
   * Call without arguments to receive all types.
   * @param type type of updates to subscribe
   */
  public updates(type?: UpdateType): Observable<Update> {
    return typeof type === 'string'
      ? this.#updates.pipe(filter((update) => type in update))
      : this.#updates;
  }

  /**
   * Subscribe specific types of messages.
   * Call without arguments to receive all types.
   * @param type type os message to receive
   */
  public messages(type?: MessageType): Observable<WrappedMessageActions> {
    const messages$ = this.updates('message').pipe(
      map((update) => ({
        update,
        actions: update.message
          ? createMessageActions(update.message, this)
          : null,
      })),
    );

    return type
      ? messages$.pipe(
          filter(
            (update) =>
              !!update.update?.message && type in update.update.message,
          ),
        )
      : messages$;
  }

  /**
   * call
   */
  call = async <
    FnName extends keyof ApiMethods,
    FnArgs = ApiMethods[FnName][0],
    FnReturn = ApiMethods[FnName][1],
  >(
    ...args: ApiMethods[FnName] extends [never, unknown]
      ? [FnName]
      : [FnName, FnArgs]
  ): Promise<TelegramResponse<FnReturn>> => {
    if (!this.bot_token) {
      throw new Error('Telegram Bot Token undefined');
    }
    const [methodName, methodArgs] = args;
    const formData = new FormData();

    if (methodArgs) {
      Object.entries(methodArgs).forEach(([key, value]) => {
        if (typeof value === 'object' && !(value instanceof ReadStream))
          formData.append(key, JSON.stringify(value));
        else formData.append(key, value);
      });
    }
    const { data } = await this.#axios.post(methodName, formData, {
      headers: formData.getHeaders(),
    });
    return data;
  };

  private configObservables(origin: Observable<Update>) {
    origin.subscribe(this.#updates);
  }
}
