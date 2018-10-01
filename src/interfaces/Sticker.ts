import { MaskPosition } from "./MaskPosition";
import { PhotoSize } from "./PhotoSize";

export interface Sticker {
  file_id: string;
  width: number;
  height: number;
  thumb?: PhotoSize;
  emoji?: string;
  set_name?: string;
  mask_position?: MaskPosition;
  file_size?: number;
}
