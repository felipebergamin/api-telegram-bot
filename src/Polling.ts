import { EventEmitter } from 'events';
import type { Observer } from 'rxjs';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import type PollingOptions from './@types/Entities/PollingOptions';
import type Update from './@types/Entities/Update';

import type Bot from './Bot';

export type PollingStatus =
  | 'NEW'
  | 'FETCHING'
  | 'STOPPED'
  | 'FETCH_DONE'
  | 'ERROR';

/** @beta */
export class Polling {
  /**
   * Last error on polling
   */
  public lastError: unknown;

  /** @ignore */
  private status: PollingStatus = 'NEW';

  /** @ignore */
  private events: EventEmitter;

  /** @ignore */
  private offset: number;

  /** @ignore */
  private limit: number;

  /** @ignore */
  private allowed_updates: string[];

  /** @ignore */
  private timeout: number;

  /** @ignore */
  private receivedStopSignal: boolean;

  /** @ignore */
  private observable: Observable<Update>;

  /** @ignore */
  private bot: Bot;

  /** @constructor */
  constructor(
    bot: Bot,
    {
      limit = 100,
      offset = 0,
      allowed_updates = [],
      timeout = 10,
    }: PollingOptions = {},
  ) {
    this.events = new EventEmitter();
    this.offset = offset;
    this.limit = limit;
    this.allowed_updates = allowed_updates;
    this.timeout = timeout;
    this.receivedStopSignal = false;
    this.bot = bot;
    this.setStatus('NEW');

    this.observable = this.createObservable().pipe(share());
  }

  /**
   * return true if is polling, false otherwise.
   * E.g. return true is `stopPolling()` was called
   */
  public get isPolling(): boolean {
    return ['NEW', 'STOPPED'].indexOf(this.status) === -1;
  }

  /**
   * emits objects with the update received and a `type` field describing update type
   */
  public get updates(): Observable<Update> {
    return this.observable;
  }

  /**
   * Call this function to start polling
   */
  public startPolling() {
    // bot will subscribe to updates observable and polling will start
    this.bot.setPolling(this);
  }

  /**
   * set a flag to stop polling and close all observables.
   * note: due to long polling implementation logic, an update fetch may be running when you call stopPolling()
   * because this, some updates may be delivered once after call `stopPolling`
   * @returns a promise that will be fulfilled when last fetch was done
   */
  public stopPolling(): Promise<void> {
    this.receivedStopSignal = true;
    return this.status === 'STOPPED'
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          const onStopCbk = (status: PollingStatus) => {
            if (status === 'STOPPED') {
              /*
                call get updates one last time only to set offset on telegram servers
                if we don't update offset, updates received by last polling fetch
                will be received again if we call getUpdates()
              */
              this.bot
                .call('getUpdates', { offset: this.offset, limit: 1 })
                .then(() => resolve())
                .catch((err) => reject(err));
              this.events.removeListener('STATUS_CHANGED', onStopCbk);
            }
          };

          this.events.on('STATUS_CHANGED', onStopCbk);
        });
  }

  public getStatus() {
    return this.status;
  }

  private setStatus(status: PollingStatus) {
    this.status = status;
    this.events.emit('STATUS_CHANGED', status);
  }

  /** @ignore */
  private createObservable(): Observable<Update> {
    return new Observable((observer: Observer<Update>) => {
      const getUpdates = async (): Promise<void> => {
        this.setStatus('FETCHING');
        try {
          const updates = await this.bot.call('getUpdates', {
            allowed_updates: this.allowed_updates,
            limit: this.limit,
            offset: this.offset,
            timeout: this.timeout,
          });

          this.setStatus('FETCH_DONE');
          if (updates.ok && updates.result.length > 0) {
            this.offset =
              updates.result[updates.result.length - 1].update_id + 1;
            updates.result.forEach((update) => observer.next(update));
          }
        } catch (err) {
          this.lastError = err;
          this.setStatus('ERROR');
          observer.error(err);
        }

        if (!this.receivedStopSignal) {
          return getUpdates();
        }
        this.setStatus('STOPPED');
        return observer.complete();
      };

      getUpdates();
    });
  }
}
