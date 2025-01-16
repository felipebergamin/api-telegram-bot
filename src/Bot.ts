import type { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import type { Polling } from './Polling';
import type { ApiMethods } from './@types';
import type { Message, Update } from './@types/generated';
import type WrappedMessageActions from './@types/WrappedMessageActions';
import type MessageType from './@types/MessageType';
import type UpdateType from './@types/UpdateType';
import type TelegramResponse from './@types/TelegramResponse';
import type { HttpBotClient, HttpClientArgs } from './helpers/createHttpClient';

import Webhook from './Webhook';
import { createMessageActions } from './utils';
import createDefaultHttpClient from './helpers/createHttpClient';

export type BotConfig = {
  bot_token: string;
  createHttpClient?: (config: HttpClientArgs) => HttpBotClient;
};

export default class Bot {
  #updates: Subject<Update>;

  #webhook: Webhook | null = null;

  #polling: Polling | null;

  #httpClient: HttpBotClient;

  /**
   * Constructs bot client
   *
   * @constructor
   * @param bot_token Bot token
   * @param config Optional config object.
   */
  constructor({
    bot_token,
    createHttpClient = createDefaultHttpClient,
  }: BotConfig) {
    this.#updates = new Subject();
    this.#polling = null;
    this.#httpClient = createHttpClient({
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
        actions: createMessageActions(update.message as Message, this),
      })),
    );

    if (!type) return messages$;

    return messages$.pipe(
      filter(
        (update) => !!update.update?.message && type in update.update.message,
      ),
    );
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
    const [methodName, methodArgs] = args;
    const { data } = await this.#httpClient.post<
      unknown,
      TelegramResponse<FnReturn>
    >(methodName, methodArgs);
    return data;
  };

  private configObservables(origin: Observable<Update>) {
    origin.subscribe(this.#updates);
  }
}
