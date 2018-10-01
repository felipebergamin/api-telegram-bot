import { PhotoSize } from "./PhotoSize";

export interface VideoNote {
  file_id: string;
  length: number;
  duration: number;
  thumb?: PhotoSize;
  file_size?: number;
}
