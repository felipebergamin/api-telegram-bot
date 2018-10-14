import { MaskPosition } from "../MaskPosition";

export interface CreateNewStickerSetOptionals {
  /**
   * Pass True, if a set of mask stickers should be created
   */
  contains_masks?: boolean;
  /**
   * A JSON-serialized object for position where the mask should be placed on faces
   */
  mask_position?: MaskPosition;
}
