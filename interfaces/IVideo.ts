import { IPhotoSize as PhotoSize } from "./IPhotoSize";

export interface IVideo {
  file_id: string;
  width: number;
  height: number;
  duration: number;
  thumb?: PhotoSize;
  mime_type?: string;
  file_size?: number;
}
