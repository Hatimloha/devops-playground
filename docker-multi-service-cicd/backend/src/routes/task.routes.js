import { Router } from "express";

import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  removeTask
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", removeTask);

export default router;