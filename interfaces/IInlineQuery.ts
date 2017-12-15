import { ILocation as Location } from "./ILocation";
import { IUser as User } from "./IUser";

export interface IInlineQuery {
  id: string;
  from: User;
  location?: Location;
  query: string;
  offset: string;
}
