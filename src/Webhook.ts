/* tslint:disable:max-line-length */
import EventEmitter = require("events");
import { IncomingMessage, ServerResponse } from "http";
import { fromEvent, Observable } from "rxjs";
import { map, share } from "rxjs/operators";

import { Bot } from "./Bot";
import { debug } from "./debug";
import { Update } from "./interfaces";
import { checkUpdateType, ExplicitTypedUpdate } from "./utils";

export class Webhook {
  private _events = new EventEmitter();
  private observable: Observable<Update>;

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot TelegramBotClient instance
   */
  constructor(private bot: Bot) {
    this.observable = this._createObservable().pipe(share());
    bot.webhook = this;
  }

  public get updates(): Observable<ExplicitTypedUpdate> {
    return this.observable
      .pipe(map((update) => checkUpdateType(update)));
  }

  /**
   * Use this method to create a route manipulator function for webhook.
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

  private _createObservable(): Observable<Update> {
    return fromEvent(this._events, "update");
  }
}
