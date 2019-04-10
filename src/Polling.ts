import * as Debug from "debug";
import { EventEmitter } from "events";
import { Observable, Observer } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { Update } from "./interfaces";
import { PollingOptions } from "./interfaces/PollingOptions";
import { checkUpdateType, ExplicitTypedUpdate } from "./utils";

const debug = Debug("api-telegram-bot:polling");

export type PollingStatus = "NEW" | "FETCHING" | "STOPPED" | "FETCH_DONE" | "ERROR";

/** @beta */
export class Polling {
  /**
   * Last error on polling
   */
  public lastError: any;
  /** @ignore */
  private _status: PollingStatus;
  /** @ignore */
  private _events: EventEmitter;
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

  /** @constructor */
  constructor(private bot: Bot, { limit = 100, offset = 0, allowed_updates = [], timeout = 10 }: PollingOptions = {}) {
    this._events = new EventEmitter();
    this.offset = offset;
    this.limit = limit;
    this.allowed_updates = allowed_updates;
    this.timeout = timeout;
    this.receivedStopSignal = false;
    this.setStatus("NEW");

    this.observable = this.createObservable().pipe(share());
  }

  /**
   * Flag to polling state. Could be:
   * - "NEW": polling wasn't started yet
   * - "FETCHING": bot has a open connection waiting for updates
   * - "STOPPED": .stopPolling() was called and the last fetch was completed
   * - "FETCH_DONE": last fetch was completed and a new fetch will be started
   * - "ERROR": last fetch returned an error
   */
  public get status(): PollingStatus {
    return this._status;
  }

  /**
   * return true if is polling, false otherwise.
   * E.g. return true is `stopPolling()` was called
   */
  public get isPolling(): boolean {
    return ['NEW', 'STOPPED'].indexOf(this._status) === -1;
  }

  /**
   * emits objects with the update received and a `type` field describing update type
   */
  public get updates(): Observable<ExplicitTypedUpdate> {
    return this.observable
      .pipe(map((update) => checkUpdateType(update)));
  }

  /**
   * Call this function to start polling
   */
  public startPolling() {
    // bot will subscribe to updates observable and polling will start
    this.bot.polling = this;
  }

  /**
   * set a flag to stop polling and close all observables.
   * note: due to long polling implementation logic, an update fetch may be running when you call stopPolling()
   * because this, some updates may be delivered once after call `stopPolling`
   * @returns a promise that will be fulfilled when last fetch was done
   */
  public stopPolling(): Promise<void> {
    debug("Stop polling");
    this.receivedStopSignal = true;
    return this.status === "STOPPED"
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
          const onStopCbk = (status) => {
            debug("CBK: " + status);
            if (status === "STOPPED") {
              /*
                call get updates one last time only to set offset on telegram servers
                if we don't update offset, updates received by last polling fetch
                will be received again if we call getUpdates()
              */
              this.bot.getUpdates({ offset: this.offset, limit: 1 })
                .then(() => resolve())
                .catch((err) => reject(err));
              this._events.removeListener("STATUS_CHANGED", onStopCbk);
            }
          };

          this._events.on("STATUS_CHANGED", onStopCbk);
        });
  }

  private setStatus(status: PollingStatus) {
    this._status = status;
    this._events.emit("STATUS_CHANGED", status);
    debug("Status changed to %s", status);
  }

  /** @ignore */
  private createObservable(): Observable<Update> {
    return Observable.create((observer: Observer<Update>) => {
      debug("Creating Observable");

      const getUpdates = async () => {
        this.setStatus("FETCHING");
        debug("Getting updates: %j", {
          allowed_updates: this.allowed_updates,
          limit: this.limit,
          offset: this.offset,
          timeout: this.timeout,
        });

        try {
          const updates = await this.bot.getUpdates({
            allowed_updates: this.allowed_updates,
            limit: this.limit,
            offset: this.offset,
            timeout: this.timeout,
          });

          this.setStatus('FETCH_DONE');
          debug(`received ${updates.result.length} updates`);
          if (updates.ok && updates.result.length > 0) {
            this.offset = updates.result[updates.result.length - 1].update_id + 1;
            for (const u of updates.result) {
              observer.next(u);
            }
          }
        } catch (err) {

          this.lastError = err;
          this.setStatus("ERROR");

          debug("error on fetch updates");
          observer.error(err);
        }

        if (!this.receivedStopSignal) {
          return await getUpdates();
        }
        debug(`Stop flag is ${this.receivedStopSignal}, stopping polling`);
        this.setStatus("STOPPED");
        observer.complete();
      };

      getUpdates();
    });
  }
}
