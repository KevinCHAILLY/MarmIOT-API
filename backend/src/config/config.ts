import dotenv from "dotenv";

dotenv.config();

export const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "yourpassword",
    database: process.env.DB_NAME || "marmiot",
  },
  port: parseInt(process.env.PORT || "3000"),
  swaggerPath: process.env.SWAGGER_PATH || "/api-docs",
};