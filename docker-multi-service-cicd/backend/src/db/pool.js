import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.DB_POOL_MAX,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT_MS,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS,
  application_name: "taskmanager-api"
});

pool.on("error", (error) => {
  console.error("Unexpected idle PostgreSQL client error:", error);
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function checkDatabase() {
  const result = await query("SELECT 1 AS connected");

  return result.rows[0].connected === 1;
}