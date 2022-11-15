import type Sticker from './Sticker';

export default interface StickerSet {
  /** Sticker set name */
  name: string;
  /** Sticker set title */
  title: string;
  /** True, if the sticker set contains masks */
  contains_masks: boolean;
  /** List of all set stickers */
  stickers: Sticker[];
}
