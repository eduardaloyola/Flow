import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createTask,
  deleteTask,
  getStats,
  listTasks,
  updateTask,
} from "../controllers/tasks.controller";

const router = Router();

router.use(authMiddleware);

router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/stats/summary", getStats);

export default router;
