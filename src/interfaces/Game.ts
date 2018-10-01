import { Animation } from "./Animation";
import { MessageEntity } from "./MessageEntity";
import { PhotoSize } from "./PhotoSize";

export interface Game {
  title: string;
  description: string;
  photo: PhotoSize[];
  text?: string;
  text_entities?: MessageEntity[];
  animation?: Animation;
}
