import type Location from './Location';
import type User from './User';

export default interface InlineQuery {
  /** Unique identifier for this query */
  id: string;
  /** Sender */
  from: User;
  /** Optional. Sender location, only for bots that request user location */
  location?: Location;
  /** Text of the query (up to 512 characters) */
  query: string;
  /** Offset of the results to be returned, can be controlled by the bot */
  offset: string;
}
