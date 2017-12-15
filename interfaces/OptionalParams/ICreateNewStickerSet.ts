import { IMaskPosition as MaskPosition } from "../IMaskPosition";

export interface ICreateNewStickerSetOptionals {
  contains_masks?: boolean;
  mask_position?: MaskPosition;
}
