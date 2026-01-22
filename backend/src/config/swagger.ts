import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";

export const setupSwagger = (app: any) => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "MarmIOT API",
        version: "1.0.0",
        description: "API for managing IoT sensors and events",
      },
      servers: [
        {
          url: `http://localhost:${config.port}`,
          description: "Development server",
        },
      ],
    },
    apis: ["src/routes/*.ts"],
  };

  const specs = swaggerJsdoc(options);
  app.use(config.swaggerPath, swaggerUi.serve, swaggerUi.setup(specs));
};