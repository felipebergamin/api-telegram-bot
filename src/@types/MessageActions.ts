import type { Message, SendMessage } from './generated';
import type TelegramResponse from './TelegramResponse';

export interface MessageActions {
  /**
   * Receives the date when the user will be unbanned, unix time.
   * If user is banned for more than 366 days or less than 30 seconds
   * from the current time they are considered to be banned forever
   * @param until date when the user will be unbanned
   * @see {@link https://core.telegram.org/bots/api#kickchatmember}
   */
  banChatMember?: (until: number) => Promise<TelegramResponse<boolean>>;
  /**
   * delete the message, see limitations on telegram documentation
   * @see {@link https://core.telegram.org/bots/api#deletemessage}
   */
  deleteMessage?: () => Promise<TelegramResponse<boolean>>;
  /**
   * shorthand to send a reply to received message.
   * same as call `sendMessage` with `reply_to_message_id` param
   * @param args message args to be sent
   */
  reply(
    args: Omit<SendMessage, 'chat_id' | 'reply_to_message_id'>,
  ): Promise<TelegramResponse<Message>>;
  /**
   * shorthand to send a reply to received message.
   * same as call `sendMessage` with `reply_to_message_id` param
   * @param args message args to be sent
   */
  reply(text: string): Promise<TelegramResponse<Message>>;
}
