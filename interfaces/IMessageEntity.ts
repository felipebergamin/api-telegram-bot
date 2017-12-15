import { IUser as User } from "./IUser";

export interface IMessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: User;
}
