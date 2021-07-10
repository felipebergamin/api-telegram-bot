import { Message } from './Message';
import { User } from './User';

export interface CallbackQuery {
  /** Unique identifier for this query */
  id: string;
  /** Sender */
  from: User;
  /** Message with the callback button that originated the query. */
  message?: Message;
  /** Identifier of the message sent via the bot in inline mode, that originated the query. */
  inline_message_id?: string;
  /** Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent */
  chat_instance: string;
  /**  	Optional. Data associated with the callback button. */
  data?: string;
  /** Optional. Short name of a Game to be returned, serves as the unique identifier for the game */
  game_short_name?: string;
}
