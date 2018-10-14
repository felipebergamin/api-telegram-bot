import { Animation } from "./Animation";
import { MessageEntity } from "./MessageEntity";
import { PhotoSize } from "./PhotoSize";

export interface Game {
  /** Title of the game */
  title: string;
  /** Description of the game */
  description: string;
  /** Photo that will be displayed in the game message in chats. */
  photo: PhotoSize[];
  /** Optional. Brief description of the game or high scores included in the game message. */
  text?: string;
  /** Optional. Special entities that appear in text, such as usernames, URLs, bot commands, etc. */
  text_entities?: MessageEntity[];
  /**  	Optional. Animation that will be displayed in the game message in chats. Upload via BotFather */
  animation?: Animation;
}
