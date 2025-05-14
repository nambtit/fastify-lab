import { FastifyInstance } from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export async function configSwagger(app: FastifyInstance) {
  const swaggerOptions = {
    swagger: {
      info: {
        title: "Auth Service",
        description: "Auth Service API documentation",
        version: "1.0.0",
      },
      host: `localhost:${process.env.PORT || 3000}`,
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  };

  const swaggerUiOptions = {
    routePrefix: "/docs",
    exposeRoute: true,
  };

  app.register(fastifySwagger, swaggerOptions);
  app.register(fastifySwaggerUi, swaggerUiOptions);
}
