import { User } from "./User";

export interface Session {
  id: string;
  user: User;
  duration: number;
  endAt: Date;
} // createdAt and endAt matic nmn
