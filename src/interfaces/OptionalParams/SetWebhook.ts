import { ReadStream } from "fs";

export interface SetWebhookOptionals {
  certificate?: ReadStream;
  max_connections?: number;
  allowed_updates?: string[];
}
