import { Location } from "./Location";
import { User } from "./User";

export interface ChosenInlineResult {
  /** The unique identifier for the result that was chosen */
  result_id: string;
  /** The user that chose the result */
  from: User;
  /** Optional. Sender location, only for bots that require user location */
  location?: Location;
  /** Optional. Identifier of the sent inline message. */
  inline_message_id?: string;
  /** The query that was used to obtain the result */
  query: string;
}
