import { User } from "./User";

export interface GameHighScore {
  position?: number;
  user?: User;
  score?: number;
}
