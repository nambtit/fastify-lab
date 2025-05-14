import { IRepositoryContainer } from "../repositories/IRepositoryContainer";
import { IAuthService } from "../services/IAuthService";
import { IUserService } from "../services/IUserService";
import { IPasswordResetService } from "../services/IPasswordResetService";

declare module "fastify" {
  interface FastifyInstance {
    container: {
      userRepository: IRepositoryContainer["userRepository"];
      accessTokenRepository: IRepositoryContainer["accessTokenRepository"];
      refreshTokenRepository: IRepositoryContainer["refreshTokenRepository"];
      passwordResetRepository: IRepositoryContainer["passwordResetRepository"];
      authService: IAuthService;
      userService: IUserService;
      passwordResetService: IPasswordResetService;
    };
  }
}
