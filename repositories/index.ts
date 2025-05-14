import { IRepositoryContainer } from "./IRepositoryContainer";
import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { InMemoryAccessTokenRepository } from "./InMemoryAccessTokenRepository";
import { InMemoryRefreshTokenRepository } from "./InMemoryRefreshTokenRepository";
import { InMemoryPasswordResetRepository } from "./InMemoryPasswordResetRepository";

export const repositoryContainer: IRepositoryContainer = {
  userRepository: InMemoryUserRepository,
  accessTokenRepository: InMemoryAccessTokenRepository,
  refreshTokenRepository: InMemoryRefreshTokenRepository,
  passwordResetRepository: InMemoryPasswordResetRepository,
};

export type { IRepositoryContainer } from "./IRepositoryContainer";
