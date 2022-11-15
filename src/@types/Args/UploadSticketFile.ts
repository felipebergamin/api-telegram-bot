import type { ReadStream } from 'fs';

export default interface UploadStickerFile {
  user_id: number;
  png_sticker: ReadStream;
}
