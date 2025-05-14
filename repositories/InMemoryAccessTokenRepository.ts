import { IAccessTokenRepository } from "./IAccessTokenRepository";
import { AccessToken } from "../models/AccessToken";
import { Status } from "../config";

const inMemoryAccessTokens: AccessToken[] = [];

export const InMemoryAccessTokenRepository: IAccessTokenRepository = {
  findByJti(jti: string): AccessToken | undefined {
    return inMemoryAccessTokens.find(
      (t) => t.jti === jti && t.status === Status.ACTIVE,
    );
  },
  create(token: AccessToken): AccessToken {
    inMemoryAccessTokens.push(token);
    return token;
  },
  updateStatusByJti(jti: string, status: Status): void {
    const token = inMemoryAccessTokens.find((t) => t.jti === jti);
    if (token) {
      token.status = status;
      token.updatedAt = Date.now();
    }
  },
  invalidateByUserId(userId: string): void {
    inMemoryAccessTokens.forEach((t) => {
      if (t.userId === userId && t.status === Status.ACTIVE) {
        t.status = Status.INACTIVE;
        t.updatedAt = Date.now();
      }
    });
  },
};
