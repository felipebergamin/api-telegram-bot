import { Audio } from "./Audio";
import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { Document } from "./Document";
import { Game } from "./Game";
import { Invoice } from "./Invoice";
import { MessageEntity } from "./MessageEntity";
import { PhotoSize } from "./PhotoSize";
import { Sticker } from "./Sticker";
import { SuccessfulPayment } from "./SuccessfulPayment";
import { User } from "./User";
import { Venue } from "./Venue";
import { Video } from "./Video";
import { VideoNote } from "./VideoNote";
import { Voice } from "./Voice";

export interface Message {
  /** Unique message identifier inside this chat */
  message_id: number;
  /** Sender, empty for messages sent to channels */
  from: User;
  /** Date the message was sent in Unix time */
  date: number;
  /** Conversation the message belongs to */
  chat: Chat;
  /** For forwarded messages, sender of the original message */
  forward_from: User;
  /** For messages forwarded from channels, information about the original channel */
  forward_from_chat: Chat;
  /** For messages forwarded from channels, identifier of the original message in the channel */
  forward_from_message_id: number;
  /** For messages forwarded from channels, signature of the post author if present */
  forward_signature: string;
  /** For forwarded messages, date the original message was sent in Unix time */
  forward_date: number;
  /**
   * For replies, the original message.
   * Note that the Message object in this field will not contain further reply_to_message
   * fields even if it itself is a reply.
   */
  reply_to_message: Message;
  /** Date the message was last edited in Unix time */
  edit_date: number;
  /** The unique identifier of a media message group this message belongs to */
  media_group_id: string;
  /** Signature of the post author for messages in channels */
  author_signature: string;
  /** For text messages, the actual UTF-8 text of the message, 0-4096 characters. */
  text: string;
  /** For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text */
  entities: MessageEntity[];
  /**
   * For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
   */
  caption_entities: MessageEntity[];
  /** Message is an audio file, information about the file */
  audio: Audio;
  /** Message is a general file, information about the file */
  document: Document;
  /** Message is a game, information about the game. */
  game: Game;
  /** Message is a photo, available sizes of the photo */
  photo: PhotoSize[];
  /** Message is a sticker, information about the sticker */
  sticker: Sticker;
  /** Message is a video, information about the video */
  video: Video;
  /** Message is a voice message, information about the file */
  voice: Voice;
  /** Message is a video note, information about the video message */
  video_note: VideoNote;
  /** Caption for the audio, document, photo, video or voice, 0-200 characters */
  caption: string;
  /** Message is a shared contact, information about the contact */
  contact: Contact;
  /** Message is a shared location, information about the location */
  location: Location;
  /**  Message is a venue, information about the venue */
  venue: Venue;
  /**
   * New members that were added to the group or supergroup
   * and information about them (the bot itself may be one of these members)
   */
  new_chat_members: User[];
  /**
   * A member was removed from the group, information about them (this member may be the bot itself)
   */
  left_chat_member: User;
  /** A chat title was changed to this value */
  new_chat_title: string;
  /** A chat photo was change to this value */
  new_chat_photo: PhotoSize[];
  /** Service message: the chat photo was deleted */
  delete_chat_photo: boolean;
  /** Service message: the group has been created */
  group_chat_created: boolean;
  /** Service message: the supergroup has been created */
  supergroup_chat_created: boolean;
  /** Service message: the channel has been created. */
  channel_chat_created: boolean;
  /** The group has been migrated to a supergroup with the specified identifier */
  migrate_to_chat_id: number;
  /** The supergroup has been migrated from a group with the specified identifier. */
  migrate_from_chat_id: number;
  /** Specified message was pinned. */
  pinned_message: Message;
  /** Message is an invoice for a payment, information about the invoice. */
  invoice: Invoice;
  /** Message is a service message about a successful payment, information about the payment */
  successful_payment: SuccessfulPayment;
}
