import { FastifyInstance } from "fastify";
import { sendSuccess, sendError } from "../utils/helpers";
import {
  loginSchema,
  logoutSchema,
  refreshSchema,
} from "../schemas/authSchemas";
import { StatusCodes } from "http-status-codes";
import { PasswordResetService } from "../services/PasswordResetService";
import {
  confirmResetSchema,
  requestResetSchema,
} from "../schemas/passwordResetSchemas";

export async function authRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/auth";

  const authService = app.container.authService;
  const passwordResetService = app.container.passwordResetService;

  app.post(
    `${prefix}/login`,
    {
      schema: {
        description: "Login with email and password",
        tags: ["Auth"],
        body: loginSchema,
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body as {
          email: string;
          password: string;
        };
        const result = await authService.login(email, password);
        return sendSuccess(reply, result, "Login successful");
      } catch (err: any) {
        return sendError(reply, err.message, StatusCodes.UNAUTHORIZED);
      }
    },
  );

  app.post(
    `${prefix}/logout`,
    {
      schema: {
        description: "Logout by invalidating the refresh token",
        tags: ["Auth"],
        body: logoutSchema,
      },
    },
    async (request, reply) => {
      try {
        const { refreshToken } = request.body as { refreshToken: string };
        const authHeader = request.headers["authorization"];
        if (!authHeader)
          return sendError(
            reply,
            "Missing Authorization header",
            StatusCodes.UNAUTHORIZED,
          );
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer")
          return sendError(
            reply,
            "Invalid Authorization header format",
            StatusCodes.UNAUTHORIZED,
          );
        const accessToken = parts[1];
        await authService.logout(accessToken, refreshToken);
        return sendSuccess(reply, null, "Logout successful");
      } catch (err: any) {
        return sendError(reply, err.message, StatusCodes.UNAUTHORIZED);
      }
    },
  );

  app.post(
    `${prefix}/refresh`,
    {
      schema: {
        description: "Refresh tokens by providing a valid refresh token",
        tags: ["Auth"],
        body: refreshSchema,
      },
    },
    async (request, reply) => {
      try {
        const { refreshToken } = request.body as { refreshToken: string };
        const result = await authService.refresh(refreshToken);
        return sendSuccess(reply, result, "Token refreshed successfully");
      } catch (err: any) {
        return sendError(reply, err.message, StatusCodes.UNAUTHORIZED);
      }
    },
  );

  app.post(
    `${prefix}/password-reset/request`,
    {
      schema: {
        description: "Request a password reset token",
        tags: ["Auth"],
        body: requestResetSchema,
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body as { email: string };
        await passwordResetService.requestReset(email);
        return sendSuccess(
          reply,
          null,
          "If the email exists, a reset token has been sent.",
        );
      } catch (err: any) {
        return sendError(reply, err.message);
      }
    },
  );

  app.post(
    `${prefix}/password-reset/confirm`,
    {
      schema: {
        description: "Confirm password reset with token and new password",
        tags: ["Auth"],
        body: confirmResetSchema,
      },
    },
    async (request, reply) => {
      try {
        const { token, newPassword } = request.body as {
          token: string;
          newPassword: string;
        };
        await passwordResetService.confirmReset(token, newPassword);
        return sendSuccess(reply, null, "Password reset successful.");
      } catch (err: any) {
        return sendError(reply, err.message);
      }
    },
  );
}
