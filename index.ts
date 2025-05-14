import dotenv from "dotenv";
dotenv.config();
import fastify from "fastify";
import { APP_CONFIG } from "./config";
import { routes } from "./routes";
import { StatusCodes } from "http-status-codes";
import { configSwagger } from "./swagger";
import { container } from "./di/container";
// Module augmentation for Fastify.
import "./types/fastify";

const app = fastify({ logger: { level: APP_CONFIG.LOG_LEVEL } });

// Attach the repository container to enable dependency injection.
app.decorate("container", container);

// Global error handler.
app.setErrorHandler((error, req, reply) => {
  app.log.error(error);
  reply
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ success: false, error: "Internal Server Error" });
});

(async () => {
  const swaggerEnabled = APP_CONFIG.SERVICE_ENV !== "production";

  if (swaggerEnabled) {
    configSwagger(app);
  }

  // Register routes.
  routes(app);
  await app.ready();

  if (swaggerEnabled) {
    app.swagger();
  }
})();

app.listen({ port: APP_CONFIG.PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`${APP_CONFIG.SERVICE_NAME} is running at ${address}`);
});
