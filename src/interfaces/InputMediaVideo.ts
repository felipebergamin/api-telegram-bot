import { ReadStream } from "fs";

export interface InputMediaVideo {
  /** Type of the result, must be video */
  type: string;
  /**
   * File to send. Pass a file_id to send a file that exists on the Telegram servers,
   * pass an HTTP URL for Telegram to get a file from the Internet
   */
  media: string;
  /** Optional. Thumbnail of the file sent. The thumbnail should be in JPEG format and less than 200 kB in size. */
  thumb?: ReadStream | string;
  /** Optional. Caption of the video to be sent, 0-200 characters */
  caption?: string;
  /** Optional. Video width */
  width?: number;
  /** Optional. Video height */
  height?: number;
  /** Optional. Video duration */
  duration?: number;
  /** Optional. Pass True, if the uploaded video is suitable for streaming */
  supports_streaming?: boolean;
}
