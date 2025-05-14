import { PasswordResetToken } from "../models/PasswordResetToken";
import { Status } from "../config";

export interface IPasswordResetRepository {
  findByTokenHash(tokenHash: string): PasswordResetToken | undefined;
  create(token: PasswordResetToken): PasswordResetToken;
  updateStatusById(id: string, status: Status): void;
}
