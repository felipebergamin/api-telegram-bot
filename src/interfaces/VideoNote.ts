import { PhotoSize } from "./PhotoSize";

export interface VideoNote {
  /** Unique identifier for this file */
  file_id: string;
  /** Video width and height (diameter of the video message) as defined by sender */
  length: number;
  /** Duration of the video in seconds as defined by sender */
  duration: number;
  /** Video thumbnail */
  thumb?: PhotoSize;
  /** File size */
  file_size?: number;
}
