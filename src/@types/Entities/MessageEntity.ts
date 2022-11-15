import type User from './User';

export default interface MessageEntity {
  /** Type of the entity. */
  type:
    | 'mention'
    | 'hashtag'
    | 'cashtag'
    | 'bot_command'
    | 'url'
    | 'email'
    | 'phone_number'
    | 'bold'
    | 'italic'
    | 'code'
    | 'pre'
    | 'text_link'
    | 'text_mention';
  /** Offset in UTF-16 code units to the start of the entity */
  offset: number;
  /* Length of the entity in UTF-16 code units */
  length: number;
  /** For “text_link” only, url that will be opened after user taps on the text */
  url?: string;
  /** For “text_mention” only, the mentioned user */
  user?: User;
}
