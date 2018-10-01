import { User } from "./User";

export interface MessageEntity {
  type: string;
  offset: number;
  length: number;
  url?: string;
  user?: User;
}
