import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createConnection } from "typeorm";
import { config } from "./config/config";
import { sensorRoutes } from "./routes/sensorRoutes";
import { eventRoutes } from "./routes/eventRoutes";
import { setupSwagger } from "./config/swagger";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database connection
createConnection()
  .then(() => {
    console.log("Connected to MariaDB database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

// Routes
app.use("/api/sensors", sensorRoutes);
app.use("/api/events", eventRoutes);

// Swagger documentation
setupSwagger(app);

// Start server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});