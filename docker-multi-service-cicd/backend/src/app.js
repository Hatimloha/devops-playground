import express from "express";

import taskRoutes from "./routes/task.routes.js";
import healthRoutes from "./routes/health.routes.js";

import { requestIdMiddleware } from "./middleware/request-id.js";
import { requestLogger } from "./middleware/logger.js";
import {
  notFoundHandler,
  errorHandler
} from "./middleware/error-handler.js";

const app = express();

app.disable("x-powered-by");
app.disable("etag");

app.use(requestIdMiddleware);
app.use(requestLogger);

app.use(express.json({ limit: "1mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;