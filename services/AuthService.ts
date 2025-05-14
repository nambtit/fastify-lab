import { IAuthService } from "./IAuthService";
import { IUserRepository } from "../repositories/IUserRepository";
import { IAccessTokenRepository } from "../repositories/IAccessTokenRepository";
import { IRefreshTokenRepository } from "../repositories/IRefreshTokenRepository";
import { IPasswordResetRepository } from "../repositories/IPasswordResetRepository";
import { APP_CONFIG, Status } from "../config";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJWT,
  decodeProtectedHeader,
  decodeJwt,
} from "../utils/jwt";
import { hashToken } from "../utils/crypto";
import bcrypt from "bcrypt";
import crypto from "crypto";

export class AuthService implements IAuthService {
  constructor(
    private userRepository: IUserRepository,
    private accessTokenRepository: IAccessTokenRepository,
    private refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error("Invalid email or password");
    }
    const now = Date.now();
    this.accessTokenRepository.invalidateByUserId(user.id);

    const {
      token: accessTokenRaw,
      jti,
      issuedAt,
    } = await generateAccessToken(email);
    const accessHeader = decodeProtectedHeader(accessTokenRaw);
    const accessPayload = decodeJwt(accessTokenRaw);
    const { exp: accessExpiration, nbf: notBefore } = accessPayload;
    this.accessTokenRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      jti,
      issuedAt,
      expiration: accessExpiration || now,
      notBefore: notBefore || now,
      header: accessHeader,
      payload: accessPayload,
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    const {
      token: refreshTokenRaw,
      issuedAt: refreshIssuedAt,
      expiredAt: refreshExpiredAt,
    } = await generateRefreshToken(email);
    this.refreshTokenRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashToken(refreshTokenRaw),
      issuedAt: refreshIssuedAt,
      expiration: refreshExpiredAt,
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });

    return {
      accessToken: accessTokenRaw,
      refreshToken: refreshTokenRaw,
    };
  }

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    const verified = await verifyJWT(accessToken);
    const { sub, jti } = verified.payload;
    const user = this.userRepository.findByEmail(sub as string);
    if (!user) {
      throw new Error("User not found");
    }
    this.accessTokenRepository.updateStatusByJti(
      jti as string,
      Status.INACTIVE,
    );
    const refreshHash = hashToken(refreshToken);
    this.refreshTokenRepository.updateStatusByTokenHash(
      refreshHash,
      Status.INACTIVE,
    );
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const providedHash = hashToken(refreshToken);
    const storedToken =
      this.refreshTokenRepository.findByTokenHash(providedHash);
    if (!storedToken) {
      throw new Error("Invalid refresh token");
    }
    if (Date.now() > storedToken.expiration) {
      this.refreshTokenRepository.updateStatusByTokenHash(
        providedHash,
        Status.INACTIVE,
      );
      throw new Error("Refresh token expired");
    }
    const now = Date.now();
    const user = this.userRepository.findById(storedToken.userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    try {
      await verifyJWT(refreshToken);
    } catch (e) {
      this.refreshTokenRepository.updateStatusByTokenHash(
        providedHash,
        Status.INACTIVE,
      );
      throw new Error("Invalid refresh token");
    }
    this.accessTokenRepository.invalidateByUserId(user.id);
    const {
      token: newAccessTokenRaw,
      jti,
      issuedAt: accessIssuedAt,
    } = await generateAccessToken(user.email);
    const accessHeader = decodeProtectedHeader(newAccessTokenRaw);
    const accessPayload = decodeJwt(newAccessTokenRaw);
    const newAccessExpiration = now + APP_CONFIG.ACCESS_TOKEN_EXPIRATION_MS;
    this.accessTokenRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      jti,
      issuedAt: accessIssuedAt,
      expiration: newAccessExpiration,
      notBefore: now,
      header: accessHeader,
      payload: accessPayload,
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
    this.refreshTokenRepository.updateStatusByTokenHash(
      providedHash,
      Status.INACTIVE,
    );
    const { token: newRefreshTokenRaw, issuedAt: refreshIssuedAt } =
      await generateRefreshToken(user.email);
    const newRefreshExpiration = now + APP_CONFIG.REFRESH_TOKEN_EXPIRATION_MS;
    this.refreshTokenRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hashToken(newRefreshTokenRaw),
      issuedAt: refreshIssuedAt,
      expiration: newRefreshExpiration,
      status: Status.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
    return {
      accessToken: newAccessTokenRaw,
      refreshToken: newRefreshTokenRaw,
    };
  }
}
