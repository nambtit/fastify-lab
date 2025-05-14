import { FastifyInstance } from "fastify";
import { authRoutes } from "./auth";
import { userRoutes } from "./user";

export async function routes(app: FastifyInstance) {
  app.register((pluggin, options, done) => {
    userRoutes(pluggin);
    authRoutes(pluggin);
    done();
  });
}
