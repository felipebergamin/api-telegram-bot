/* tslint:disable:max-line-length */
import * as Debug from "debug";
import EventEmitter = require("events");
import { IncomingMessage, ServerResponse } from "http";
import { fromEvent, Observable } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { Update } from "./interfaces";
import { checkUpdateType, ExplicitTypedUpdate } from "./utils";

const debug = Debug("api-telegram-bot:webhook");

export class Webhook {
  /** @ignore */
  private _events = new EventEmitter();
  /** @ignore */
  private observable: Observable<Update>;
  private receivedStopSinal: boolean;

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot Bot instance
   */
  constructor(private bot: Bot) {
    this.observable = this._createObservable().pipe(share());
    bot.webhook = this;
  }

  /**
   * @return an observable that emits objects with the update received and a `type` field describing update type
   */
  public get updates(): Observable<ExplicitTypedUpdate> {
    return this.observable
      .pipe(map((update) => checkUpdateType(update)));
  }

  /**
   * Use this method to create a route manipulator function for webhook.
   * @return http request handler function
   */
  public getWebhook(): (req: IncomingMessage, res: ServerResponse) => void {
    return (req: IncomingMessage, res: ServerResponse) => {
      if (req.method === "POST") {
        const chunks: any[] = [];
        let body: string;
        let receivedData: any;

        req.on("error", (err) => {
          res.statusCode = 500;
          this._events.emit("error", err);
          res.end();
        })
          .on("data", (chunk) => {
            chunks.push(chunk);
          })
          .on("end", () => {
            try {
              body = Buffer.concat(chunks).toString();
              receivedData = JSON.parse(body);
              res.statusCode = 200;
              res.end();
            } catch (err) {
              this._events.emit("error", err);
              res.statusCode = 400;
              res.end();
            }

            debug("webhook: POST received on Webhook:");
            debug(body);

            this._events.emit("update", receivedData);
          });
      } else {
        debug(`webhook: ${req.method} received, but expecting POST`);
        res.statusCode = 404;
        res.end();
      }
    };
  }

  /**
   * @ignore
   */
  private _createObservable(): Observable<Update> {
    return fromEvent(this._events, "update");
  }
}
