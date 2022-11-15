import type { ReadStream } from 'fs';

import type MaskPosition from '../Entities/MaskPosition';

export default interface AddSticketToSet {
  user_id: number | string;
  name: string;
  png_sticker: ReadStream | string;
  emojis: string;
  mask_position?: MaskPosition;
}
