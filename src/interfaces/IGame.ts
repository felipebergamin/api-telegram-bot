import { IAnimation as Animation } from "./IAnimation";
import { IMessageEntity as MessageEntity } from "./IMessageEntity";
import { IPhotoSize as PhotoSize } from "./IPhotoSize";

export interface IGame {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
  animation?: Animation;
}
