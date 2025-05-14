import { Status } from "../config";

export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  issuedAt: number;
  expiration: number;
  status: Status;
  createdAt: number;
  updatedAt: number;
}
