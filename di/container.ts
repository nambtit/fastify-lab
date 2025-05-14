import { repositoryContainer } from "../repositories";
import { AuthService } from "../services/AuthService";
import { IAuthService } from "../services/IAuthService";
import { UserService } from "../services/UserService";
import { IUserService } from "../services/IUserService";
import { PasswordResetService } from "../services/PasswordResetService";
import { IPasswordResetService } from "../services/IPasswordResetService";

export const container = {
  userRepository: repositoryContainer.userRepository,
  accessTokenRepository: repositoryContainer.accessTokenRepository,
  refreshTokenRepository: repositoryContainer.refreshTokenRepository,
  passwordResetRepository: repositoryContainer.passwordResetRepository,

  authService: new AuthService(
    repositoryContainer.userRepository,
    repositoryContainer.accessTokenRepository,
    repositoryContainer.refreshTokenRepository,
  ) as IAuthService,
  userService: new UserService(
    repositoryContainer.userRepository,
  ) as IUserService,
  passwordResetService: new PasswordResetService(
    repositoryContainer.userRepository,
    repositoryContainer.passwordResetRepository,
  ) as IPasswordResetService,
};
