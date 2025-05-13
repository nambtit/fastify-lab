import { RefreshToken } from "../models/RefreshToken";
import { Status } from "../config";

export interface IRefreshTokenRepository {
  findByTokenHash(tokenHash: string): RefreshToken | undefined;
  create(token: RefreshToken): RefreshToken;
  updateStatusByTokenHash(tokenHash: string, status: Status): void;
}
