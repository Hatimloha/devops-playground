import app from "./app.js";
import { env } from "./config/env.js";
import { pool, checkDatabase } from "./db/pool.js";

let isShuttingDown = false;

const server = app.listen(env.PORT, "0.0.0.0", async () => {
  try {
    await checkDatabase();

    console.log(
      JSON.stringify({
        level: "info",
        message: "API server started",
        port: env.PORT,
        environment: env.NODE_ENV
      })
    );
  } catch (error) {
    console.error("Initial database connection failed:", error.message);
    await shutdown("STARTUP_FAILURE", 1);
  }
});

server.on("error", (error) => {
  console.error("HTTP server error:", error);
  shutdown("SERVER_ERROR", 1);
});

async function shutdown(signal, exitCode = 0) {
  if (isShuttingDown) return;

  isShuttingDown = true;

  console.log(`Received ${signal}; shutting down gracefully`);

  server.close(async (error) => {
    if (error) {
      console.error("Error closing HTTP server:", error);
      process.exitCode = 1;
    }

    try {
      await pool.end();
      console.log("PostgreSQL pool closed");
    } catch (dbError) {
      console.error("Error closing database pool:", dbError);
      process.exitCode = 1;
    }

    process.exit(process.exitCode || exitCode);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));