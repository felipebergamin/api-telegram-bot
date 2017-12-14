import { ReadStream } from "fs";

export interface ISetWebhookOptionals {
  certificate?: ReadStream;
  max_connections?: number;
  allowed_updates?: string[];
}
