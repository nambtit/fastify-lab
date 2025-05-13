import { IPasswordResetService } from "./IPasswordResetService";
import { IUserRepository } from "../repositories/IUserRepository";
import { IPasswordResetRepository } from "../repositories/IPasswordResetRepository";
import { APP_CONFIG, Status } from "../config";
import { hashToken } from "../utils/crypto";
import bcrypt from "bcrypt";
import crypto from "crypto";

export class PasswordResetService implements IPasswordResetService {
  constructor(
    private userRepository: IUserRepository,
    private passwordResetRepository: IPasswordResetRepository
  ) {}

  async requestReset(email: string): Promise<void> {
    // Always simulate success even if the user doesn't exist.
    const user = this.userRepository.findByEmail(email);
    if (user) {
      const now = Date.now();
      const rawResetToken = crypto.randomUUID();
      const tokenHash = hashToken(rawResetToken);
      const expiration = now + APP_CONFIG.PASSWORD_RESET_TOKEN_EXPIRATION_MS;
      
      this.passwordResetRepository.create({
        id: crypto.randomUUID(),
        userId: user.id,
        tokenHash,
        issuedAt: now,
        expiration,
        status: Status.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
      // Simulate email sending by logging the raw reset token.
      console.log(`Password reset token for ${email}: ${rawResetToken}`);
    }
  }

  async confirmReset(token: string, newPassword: string): Promise<void> {
    const providedHash = hashToken(token);
    const resetRecord = this.passwordResetRepository.findByTokenHash(providedHash);
    if (!resetRecord) {
      throw new Error("Invalid or expired reset token");
    }
    if (Date.now() > resetRecord.expiration) {
      this.passwordResetRepository.updateStatusById(resetRecord.id, Status.INACTIVE);
      throw new Error("Reset token expired");
    }

    const user = this.userRepository.findById(resetRecord.userId);
    if (!user) {
      throw new Error("User not found");
    }
    const now = Date.now();
    const salt = await bcrypt.genSalt(APP_CONFIG.BCRYPT_SALT_ROUNDS);
    const newHash = await bcrypt.hash(newPassword, salt);
    
    user.passwordHash = newHash;
    user.salt = salt;
    // Update the user record and mark the token as inactive
    this.userRepository.update(user);
    this.passwordResetRepository.updateStatusById(resetRecord.id, Status.INACTIVE);
  }
}
