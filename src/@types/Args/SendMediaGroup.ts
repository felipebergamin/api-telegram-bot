import type InputMediaAnimation from './InputMediaAnimation';
import type InputMediaAudio from './InputMediaAudio';
import type InputMediaDocument from './InputMediaDocument';
import type InputMediaPhoto from './InputMediaPhoto';
import type InputMediaVideo from './InputMediaVideo';

export interface InputMedia
  extends InputMediaPhoto,
    InputMediaVideo,
    InputMediaAnimation,
    InputMediaAudio,
    InputMediaDocument {}

export default interface SendMediaGroup {
  chat_id: number | string;
  media: InputMedia[];
  /**
   * Sends the messages silently. Users will receive a notification with no sound
   */
  disable_notification?: boolean;
  /**
   * If the messages are a reply, ID of the original message
   */
  reply_to_message_id?: number;
}
