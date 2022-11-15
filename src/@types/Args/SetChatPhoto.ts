import type { ReadStream } from 'fs';

export default interface SetChatPhoto {
  chat_id: number | string;
  photo: ReadStream;
}
