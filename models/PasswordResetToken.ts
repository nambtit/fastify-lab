import { Status } from "../config";

export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  issuedAt: number;
  expiration: number;
  status: Status;
  createdAt: number;
  updatedAt: number;
}
