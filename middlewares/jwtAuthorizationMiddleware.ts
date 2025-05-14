import { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/helpers";
import { verifyJWT } from "../utils/jwt";

export async function jwtAuthorizationMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const authHeader = request.headers["authorization"];
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

    const verified = await verifyJWT(token);
    const { nbf, exp } = verified.payload;
    const now = Date.now() / 1000;

    if (!nbf || now < (nbf as number)) {
      throw new Error("Access token not yet valid");
    }

    if (!exp || now > (exp as number)) {
      throw new Error("Access token expired");
    }

    (request as any).user = verified.payload;
  } catch (err: any) {
    return sendError(reply, err.message, StatusCodes.UNAUTHORIZED);
  }
}
