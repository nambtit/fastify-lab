import { IRefreshTokenRepository } from "./IRefreshTokenRepository";
import { RefreshToken } from "../models/RefreshToken";
import { Status } from "../config";

const inMemoryRefreshTokens: RefreshToken[] = [];

export const InMemoryRefreshTokenRepository: IRefreshTokenRepository = {
  findByTokenHash(tokenHash: string): RefreshToken | undefined {
    return inMemoryRefreshTokens.find(
      (rt) => rt.tokenHash === tokenHash && rt.status === Status.ACTIVE,
    );
  },
  create(token: RefreshToken): RefreshToken {
    inMemoryRefreshTokens.push(token);
    return token;
  },
  updateStatusByTokenHash(tokenHash: string, status: Status): void {
    const token = inMemoryRefreshTokens.find(
      (rt) => rt.tokenHash === tokenHash,
    );
    if (token) {
      token.status = status;
      token.updatedAt = Date.now();
    }
  },
};
