import { Status } from "../config";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  status: Status;
  createdAt: number;
  updatedAt: number;
}
