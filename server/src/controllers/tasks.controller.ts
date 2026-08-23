import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { readDb, writeDb } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { Priority, Task } from "../types";

const VALID_PRIORITIES: Priority[] = ["baixa", "media", "alta"];

export function listTasks(req: AuthenticatedRequest, res: Response): void {
  const db = readDb();
  const userTasks = db.tasks
    .filter((t) => t.userId === req.userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  res.json({ tasks: userTasks });
}

export function createTask(req: AuthenticatedRequest, res: Response): void {
  const { title, description, category, priority, dueDate } = req.body as {
    title?: string;
    description?: string;
    category?: string;
    priority?: Priority;
    dueDate?: string | null;
  };

  if (!title || !title.trim()) {
    res.status(400).json({ message: "O título da tarefa é obrigatório." });
    return;
  }

  const finalPriority: Priority =
    priority && VALID_PRIORITIES.includes(priority) ? priority : "media";

  const now = new Date().toISOString();

  const newTask: Task = {
    id: uuidv4(),
    userId: req.userId as string,
    title: title.trim(),
    description: description?.trim() || "",
    category: category?.trim() || "Geral",
    priority: finalPriority,
    dueDate: dueDate || null,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  const db = readDb();
  db.tasks.push(newTask);
  writeDb(db);

  res.status(201).json({ task: newTask });
}

export function updateTask(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const db = readDb();
  const task = db.tasks.find((t) => t.id === id && t.userId === req.userId);

  if (!task) {
    res.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }

  const { title, description, category, priority, dueDate, completed } =
    req.body as Partial<Task>;

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (category !== undefined) task.category = category;
  if (priority !== undefined && VALID_PRIORITIES.includes(priority)) {
    task.priority = priority;
  }
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;

  task.updatedAt = new Date().toISOString();

  writeDb(db);

  res.json({ task });
}

export function deleteTask(req: AuthenticatedRequest, res: Response): void {
  const { id } = req.params;
  const db = readDb();
  const index = db.tasks.findIndex((t) => t.id === id && t.userId === req.userId);

  if (index === -1) {
    res.status(404).json({ message: "Tarefa não encontrada." });
    return;
  }

  db.tasks.splice(index, 1);
  writeDb(db);

  res.status(204).send();
}

export function getStats(req: AuthenticatedRequest, res: Response): void {
  const db = readDb();
  const userTasks = db.tasks.filter((t) => t.userId === req.userId);

  const total = userTasks.length;
  const completed = userTasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const overdue = userTasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  const byPriority: Record<Priority, number> = { baixa: 0, media: 0, alta: 0 };
  userTasks.forEach((t) => {
    if (!t.completed) byPriority[t.priority] += 1;
  });

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  res.json({ total, completed, pending, overdue, completionRate, byPriority });
}
