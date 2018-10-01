import { Location } from "./Location";
import { User } from "./User";

export interface InlineQuery {
  id: string;
  from: User;
  location?: Location;
  query: string;
  offset: string;
}
