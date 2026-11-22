import { z } from "zod";

import * as taskService from "../services/task.service.js";

const uuidSchema = z.uuid();

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().max(5000).optional()
}).strict();

const updateTaskSchema = z.object({
  title: z.string().trim().min(1).max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(["pending", "in_progress", "completed"])
}).strict();

const statusSchema = z.enum(["pending", "in_progress", "completed"]);

function validateUUID(id) {
  return uuidSchema.safeParse(id).success;
}

function sendValidationError(res, requestId, details) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Request validation failed",
      details,
      requestId
    }
  });
}

export async function listTasks(req, res) {
  const statusResult = statusSchema.safeParse(req.query.status);

  if (req.query.status && !statusResult.success) {
    return sendValidationError(res, req.requestId, {
      status: "Invalid task status"
    });
  }

  const tasks = await taskService.getAllTasks(req.query.status);

  res.json({ data: tasks });
}

export async function getTask(req, res) {
  if (!validateUUID(req.params.id)) {
    return sendValidationError(res, req.requestId, {
      id: "Invalid UUID"
    });
  }

  const task = await taskService.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task not found",
        requestId: req.requestId
      }
    });
  }

  res.json({ data: task });
}

export async function createTask(req, res) {
  const validation = createTaskSchema.safeParse(req.body);

  if (!validation.success) {
    return sendValidationError(
      res,
      req.requestId,
      validation.error.issues
    );
  }

  const task = await taskService.createTask(validation.data);

  res.status(201).json({ data: task });
}

export async function updateTask(req, res) {
  if (!validateUUID(req.params.id)) {
    return sendValidationError(res, req.requestId, {
      id: "Invalid UUID"
    });
  }

  const validation = updateTaskSchema.safeParse(req.body);

  if (!validation.success) {
    return sendValidationError(
      res,
      req.requestId,
      validation.error.issues
    );
  }

  const task = await taskService.updateTask(
    req.params.id,
    validation.data
  );

  if (!task) {
    return res.status(404).json({
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task not found",
        requestId: req.requestId
      }
    });
  }

  res.json({ data: task });
}

export async function removeTask(req, res) {
  if (!validateUUID(req.params.id)) {
    return sendValidationError(res, req.requestId, {
      id: "Invalid UUID"
    });
  }

  const deleted = await taskService.deleteTask(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      error: {
        code: "TASK_NOT_FOUND",
        message: "Task not found",
        requestId: req.requestId
      }
    });
  }

  res.status(204).end();
}