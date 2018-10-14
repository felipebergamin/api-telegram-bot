import { ReadStream } from "fs";

export interface InputMediaAudio {
  /** Type of the result, must be audio */
  type: string;
  /** File to send. */
  media: string;
  /** Optional. Thumbnail of the file sent. */
  thumb?: ReadStream | string;
  /** Optional. Caption of the audio to be sent, 0-200 characters */
  caption?: string;
  /** Optional. Send Markdown or HTML */
  parse_mode?: string;
  /** Optional. Duration of the audio in seconds */
  duration?: number;
  /** Optional. Performer of the audio */
  performer?: string;
  /** Optional. Title of the audio */
  title?: string;
}
