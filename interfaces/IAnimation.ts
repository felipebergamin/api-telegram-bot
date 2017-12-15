import { IPhotoSize as PhotoSize } from "./IPhotoSize";

export interface IAnimation {
  file_id: string;
  thumb?: PhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}
