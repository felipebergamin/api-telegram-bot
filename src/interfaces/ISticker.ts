import { IMaskPosition as MaskPosition } from "./IMaskPosition";
import { IPhotoSize as PhotoSize } from "./IPhotoSize";

export interface ISticker {
  file_id: string;
  width: number;
  height: number;
  thumb?: PhotoSize;
  emoji?: string;
  set_name?: string;
  mask_position?: MaskPosition;
  file_size?: number;
}
