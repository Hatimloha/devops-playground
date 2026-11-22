import { query } from "../db/pool.js";

export async function getAllTasks(status) {
  if (status) {
    const result = await query(
      `
      SELECT id, title, description, status, created_at, updated_at
      FROM tasks
      WHERE status = $1
      ORDER BY created_at DESC
      `,
      [status]
    );

    return result.rows;
  }

  const result = await query(
    `
    SELECT id, title, description, status, created_at, updated_at
    FROM tasks
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function getTaskById(id) {
  const result = await query(
    `
    SELECT id, title, description, status, created_at, updated_at
    FROM tasks
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function createTask({ title, description }) {
  const result = await query(
    `
    INSERT INTO tasks (title, description)
    VALUES ($1, $2)
    RETURNING id, title, description, status, created_at, updated_at
    `,
    [title, description ?? null]
  );

  return result.rows[0];
}

export async function updateTask(id, { title, description, status }) {
  const result = await query(
    `
    UPDATE tasks
    SET
      title = $2,
      description = $3,
      status = $4,
      updated_at = NOW()
    WHERE id = $1
    RETURNING id, title, description, status, created_at, updated_at
    `,
    [id, title, description ?? null, status]
  );

  return result.rows[0] ?? null;
}

export async function deleteTask(id) {
  const result = await query(
    `
    DELETE FROM tasks
    WHERE id = $1
    RETURNING id
    `,
    [id]
  );

  return result.rowCount > 0;
}