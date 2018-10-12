import { Observable, Observer } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Update } from "./interfaces";
import { PollingOptions } from "./interfaces/PollingOptions";
import { checkUpdateType, ExplicitTypedUpdate } from "./utils";

/** @beta */
export class Polling {
  /** @ignore */
  private offset;
  /** @ignore */
  private limit;
  /** @ignore */
  private allowed_updates;
  /** @ignore */
  private timeout;
  /** @ignore */
  private receivedStopSignal;
  /** @ignore */
  private observable: Observable<Update>;

  /** @constructor */
  constructor(private bot: Bot, { limit = 100, offset = 0, allowed_updates = [], timeout = 10 }: PollingOptions = {}) {
    this.offset = offset;
    this.limit = limit;
    this.allowed_updates = allowed_updates;
    this.timeout = timeout;
    this.receivedStopSignal = false;

    this.observable = this.createObservable().pipe(share());
  }

  /**
   * return true if is polling, false otherwise.
   * E.g. return true is `stopPolling()` was called
   */
  public get isPolling(): boolean {
    return !this.receivedStopSignal;
  }

  /**
   * emits objects with the update received and a `type` field describing update type
   */
  public get updates(): Observable<ExplicitTypedUpdate> {
    return this.observable
      .pipe(map((update) => checkUpdateType(update)));
  }

  /**
   * set a flag to stop polling and close all observables.
   * due to long polling implementation logic, some updates may be delivered for a short time after call `stopPolling`
   */
  public stopPolling() {
    this.receivedStopSignal = true;
  }

  /** @ignore */
  private createObservable(): Observable<Update> {
    return Observable.create((observer: Observer<Update>) => {
      debug("Creating Observable");
      const getUpdates = () => {
        debug("Getting updates: %j", {
          allowed_updates: this.allowed_updates,
          limit: this.limit,
          offset: this.offset,
          timeout: this.timeout,
        });

        return this.bot.getUpdates({
          allowed_updates: this.allowed_updates,
          limit: this.limit,
          offset: this.offset,
          timeout: this.timeout,
        }).then((updates) => {
          debug(`received ${updates.result.length} updates`);
          if (updates.ok && updates.result.length > 0) {
            this.offset = updates.result[updates.result.length - 1].update_id + 1;
            for (const u of updates.result) {
              observer.next(u);
            }
          }

          if (!this.receivedStopSignal) {
            return getUpdates();
          }
          debug(`Stop flag is ${this.receivedStopSignal}, stopping polling`);
          observer.complete();
          return updates;
        }).catch((err) => {
          debug("error on fetch updates");
          observer.error(err);
          if (!this.receivedStopSignal) {
            return getUpdates();
          }
          observer.complete();
        });
      };

      getUpdates();
    });
  }
}
