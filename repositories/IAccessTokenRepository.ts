import { AccessToken } from "../models/AccessToken";
import { Status } from "../config";

export interface IAccessTokenRepository {
  findByJti(jti: string): AccessToken | undefined;
  create(token: AccessToken): AccessToken;
  updateStatusByJti(jti: string, status: Status): void;
  invalidateByUserId(userId: string): void;
}
