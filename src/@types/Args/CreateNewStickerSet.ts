import type { ReadStream } from 'fs';

import type MaskPosition from '../Entities/MaskPosition';

export default interface CreateNewStickerSet {
  user_id: number | string;
  name: string;
  title: string;
  png_sticker: ReadStream | string;
  emojis: string;
  /**
   * Pass True, if a set of mask stickers should be created
   */
  contains_masks?: boolean;
  /**
   * A JSON-serialized object for position where the mask should be placed on faces
   */
  mask_position?: MaskPosition;
}
