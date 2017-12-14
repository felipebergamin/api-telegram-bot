import { ISticker as Sticker } from "./ISticker";

export interface IStickerSet {
  name: string;
  title: string;
  contains_masks: boolean;
  stickers: Sticker[];
}
