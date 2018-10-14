import { PhotoSize } from "./PhotoSize";

export interface Animation {
  /** Unique file identifier */
  file_id: string;
  /** Video width as defined by sender */
  width: number;
  /** Video height as defined by sender */
  height: number;
  /** Duration of the video in seconds as defined by sender */
  duration: number;
  /** Animation thumbnail as defined by sender */
  thumb?: PhotoSize;
  /** Original animation filename as defined by sender */
  file_name?: string;
  /** MIME type of the file as defined by sender */
  mime_type?: string;
  /** File size */
  file_size?: number;
}
