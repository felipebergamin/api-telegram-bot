import EventEmitter from 'events';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Observable } from 'rxjs';
import { fromEvent } from 'rxjs';
import { share } from 'rxjs/operators';

import type { Update } from './@types/generated';
import type Bot from './Bot';

export default class Webhook {
  /** @ignore */
  private events = new EventEmitter();

  /** @ignore */
  private observable: Observable<Update>;

  /**
   * class constructor
   * @class Webhook
   * @constructor
   * @param bot Bot instance
   */
  constructor(bot: Bot) {
    this.observable = this.createObservable().pipe(share());
    bot.linkToWebhook(this);
  }

  /**
   * @return an observable that emits objects with the update received and a `type` field describing update type
   */
  public get updates(): Observable<Update> {
    return this.observable;
  }

  /**
   * Use this method to create a route manipulator function for webhook.
   * @return http request handler function
   */
  public getWebhook(): (req: IncomingMessage, res: ServerResponse) => void {
    return (req: IncomingMessage, res: ServerResponse) => {
      if (req.method === 'POST') {
        const chunks: any[] = [];
        let body: string;
        let receivedData: unknown;

        req
          .on('error', (err) => {
            res.statusCode = 500;
            this.events.emit('error', err);
            res.end();
          })
          .on('data', (chunk) => {
            chunks.push(chunk);
          })
          .on('end', () => {
            try {
              body = Buffer.concat(chunks).toString();
              receivedData = JSON.parse(body);
              res.statusCode = 200;
              res.end();
            } catch (err) {
              this.events.emit('error', err);
              res.statusCode = 400;
              res.end();
            }
            this.events.emit('update', receivedData);
          });
      } else {
        res.statusCode = 404;
        res.end();
      }
    };
  }

  /**
   * @ignore
   */
  private createObservable(): Observable<Update> {
    return fromEvent(this.events, 'update');
  }
}
