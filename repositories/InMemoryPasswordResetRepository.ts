import { IPasswordResetRepository } from "./IPasswordResetRepository";
import { PasswordResetToken } from "../models/PasswordResetToken";
import { Status } from "../config";

const inMemoryPasswordResetTokens: PasswordResetToken[] = [];

export const InMemoryPasswordResetRepository: IPasswordResetRepository = {
  findByTokenHash(tokenHash: string): PasswordResetToken | undefined {
    return inMemoryPasswordResetTokens.find(
      (pr) => pr.tokenHash === tokenHash && pr.status === Status.ACTIVE,
    );
  },
  create(token: PasswordResetToken): PasswordResetToken {
    inMemoryPasswordResetTokens.push(token);
    return token;
  },
  updateStatusById(id: string, status: Status): void {
    const record = inMemoryPasswordResetTokens.find((pr) => pr.id === id);
    if (record) {
      record.status = status;
      record.updatedAt = Date.now();
    }
  },
};
