import { Status } from "../config";

export interface AccessToken {
  id: string;
  userId: string;
  jti: string;
  issuedAt: number;
  expiration: number;
  notBefore: number;
  header: Record<string, any>;
  payload: Record<string, any>;
  status: Status;
  createdAt: number;
  updatedAt: number;
}
