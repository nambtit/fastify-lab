import { FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";

export function sendSuccess(
  reply: FastifyReply,
  data: any,
  message = "Success",
) {
  return reply.status(StatusCodes.OK).send({ success: true, message, data });
}

export function sendError(
  reply: FastifyReply,
  message: string,
  statusCode = StatusCodes.BAD_REQUEST,
) {
  return reply.status(statusCode).send({ success: false, error: message });
}
