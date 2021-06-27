import { ChatPhoto } from './ChatPhoto';
import { Message } from './Message';

export interface Chat {
  /** Unique identifier for this chat. */
  id: number;
  /** Type of chat, can be either “private”, “group”, “supergroup” or “channel” */
  type: string;
  /** Optional. Title, for supergroups, channels and group chats */
  title?: string;
  /** Optional. Username, for private chats, supergroups and channels if available */
  username?: string;
  /** Optional. First name of the other party in a private chat */
  first_name?: string;
  /** Optional. Last name of the other party in a private chat */
  last_name?: string;
  /** Optional. True if a group has ‘All Members Are Admins’ enabled. */
  all_members_are_administrators?: boolean;
  /** Optional. Chat photo. Returned only in getChat. */
  photo?: ChatPhoto;
  /** Optional. Description, for supergroups and channel chats. Returned only in getChat. */
  description?: string;
  /** Optional. Chat invite link, for supergroups and channel chats. Returned only in getChat. */
  invite_link?: string;
  /** Optional. Pinned message, for supergroups and channel chats. Returned only in getChat. */
  pinned_message?: Message;
  /** Optional. For supergroups, name of group sticker set. Returned only in getChat. */
  sticker_set_name?: string;
  /** Optional. True, if the bot can change the group sticker set. Returned only in getChat. */
  can_set_sticker_set?: boolean;
}
