import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

import {env} from "../config/env.js" 
import { AsyncLocalStorage } from "node:async_hooks"

const {Client} = pg

const currenFile = fileURLToPath(import.meta.url)
const currenDir = path.dirname(currenFile)

const migrationsDir = path.resolve(
    currenDir,
    "../../../database/migrations" 
);

const client = new Client({
    connectionString: env.DATABASE_URL,
    application_name: "taskmanager-migrations",
    connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT_MS
})

async function  migrate() {
    
}