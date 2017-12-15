import { ILocation as Location } from "./ILocation";
import { IUser as User } from "./IUser";

export interface IChosenInlineResult {
  result_id: string;
  from: User;
  location?: Location;
  inline_message_id?: string;
  query: string;
}
