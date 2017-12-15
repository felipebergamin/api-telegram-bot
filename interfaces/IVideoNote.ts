import { IPhotoSize as PhotoSize } from "./IPhotoSize";

export interface IVideoNote {
  file_id: string;
  length: number;
  duration: number;
  thumb?: PhotoSize;
  file_size?: number;
}
