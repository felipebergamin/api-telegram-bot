import { Sticker } from "./Sticker";

export interface StickerSet {
  name: string;
  title: string;
  contains_masks: boolean;
  stickers: Sticker[];
}
