import { IUserRepository } from "./IUserRepository";
import { IAccessTokenRepository } from "./IAccessTokenRepository";
import { IRefreshTokenRepository } from "./IRefreshTokenRepository";
import { IPasswordResetRepository } from "./IPasswordResetRepository";

export interface IRepositoryContainer {
  userRepository: IUserRepository;
  accessTokenRepository: IAccessTokenRepository;
  refreshTokenRepository: IRefreshTokenRepository;
  passwordResetRepository: IPasswordResetRepository;
}
