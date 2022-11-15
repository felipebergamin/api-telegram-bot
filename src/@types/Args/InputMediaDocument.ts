import type { ReadStream } from 'fs';

export default interface InputMediaDocument {
  /** Type of the result, must be document */
  type: string;
  /** File to send */
  media: string;
  /** Optional. Thumbnail of the file sent. */
  thumb?: ReadStream | string;
  /** Optional. Caption of the document to be sent, 0-200 characters */
  caption?: string;
  /** Optional. Send Markdown or HTML */
  parse_mode?: string;
}
