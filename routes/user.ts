import { FastifyInstance } from "fastify";
import { sendSuccess, sendError } from "../utils/helpers";
import { UserService } from "../services/UserService";
import { registerSchema } from "../schemas/userSchemas";
import { StatusCodes } from "http-status-codes";
import { jwtAuthorizationMiddleware } from "../middlewares/jwtAuthorizationMiddleware";
import { decodeJwt } from "../utils/jwt";

export async function userRoutes(app: FastifyInstance) {
  const prefix = "/api/v1/user";
  const userService = app.container.userService;

  app.post(
    `${prefix}/register`,
    {
      schema: {
        description: "Register a new user",
        tags: ["User"],
        body: registerSchema,
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body as {
          email: string;
          password: string;
        };
        const newUser = await userService.register(email, password);
        return sendSuccess(
          reply,
          { id: newUser.id, email: newUser.email },
          "User registered successfully",
        );
      } catch (err: any) {
        return sendError(reply, err.message, StatusCodes.CONFLICT);
      }
    },
  );

  app.get(
    `${prefix}/profile`,
    {
      preHandler: jwtAuthorizationMiddleware,
      schema: {
        description: "Get user profile",
        tags: ["User"],
        body: null,
      },
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
          return sendError(
            reply,
            "Missing Authorization header",
            StatusCodes.UNAUTHORIZED,
          );
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
          return sendError(
            reply,
            "Invalid Authorization header format",
            StatusCodes.UNAUTHORIZED,
          );
        }
        const token = parts[1];
        const payload = decodeJwt(token);
        return sendSuccess(
          reply,
          { email: payload.sub },
          "Profile fetched successfully",
        );
      } catch (err: any) {
        return sendError(reply, err.message, StatusCodes.UNAUTHORIZED);
      }
    },
  );
}
