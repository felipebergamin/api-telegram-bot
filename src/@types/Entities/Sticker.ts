import type MaskPosition from './MaskPosition';
import type PhotoSize from './PhotoSize';

export default interface Sticker {
  /** Unique identifier for this file */
  file_id: string;
  /** Sticker width */
  width: number;
  /** Sticker height */
  height: number;
  /** Optional. Sticker thumbnail in the .webp or .jpg format */
  thumb?: PhotoSize;
  /** Optional. Emoji associated with the sticker */
  emoji?: string;
  /** Optional. Name of the sticker set to which the sticker belongs */
  set_name?: string;
  /** Optional. For mask stickers, the position where the mask should be placed */
  mask_position?: MaskPosition;
  /** Optional. File size */
  file_size?: number;
}
