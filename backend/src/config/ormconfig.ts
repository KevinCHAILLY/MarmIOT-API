import { ConnectionOptions } from "typeorm";
import { config } from "./config";

export const ormConfig: ConnectionOptions = {
  type: "mariadb",
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  synchronize: true,
  logging: true,
};