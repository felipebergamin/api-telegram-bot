import { IUser as User } from "./IUser";

export interface IGameHighScore {
  position?: number;
  user?: User;
  score?: number;
}
