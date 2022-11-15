import type { ReadStream } from 'fs';

export default interface InputMediaAnimation {
  /** Type of the result, must be animation */
  type: string;
  /** File to send. */
  media: string;
  /** Optional. Thumbnail of the file sent. */
  thumb?: ReadStream | string;
  /** Optional. Caption of the animation to be sent, 0-200 characters */
  caption?: string;
  /**
   * Optional. Send Markdown or HTML, if you want Telegram apps to show
   * bold, italic, fixed-width text or inline URLs in the media caption.
   */
  parse_mode?: string;
  /** Optional. Animation width */
  width?: number;
  /** Optional. Animation height */
  height?: number;
  /** Optional. Animation duration */
  duration?: number;
}
