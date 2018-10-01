import { ChatPhoto } from "./ChatPhoto";
import { Message } from "./Message";

export interface Chat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  all_members_are_administrators?: boolean;
  photo?: ChatPhoto;
  description?: string;
  invite_link?: string;
  pinned_message?: Message;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
}
