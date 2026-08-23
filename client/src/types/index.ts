export type Priority = "baixa" | "media" | "alta";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: Record<Priority, number>;
}

export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: Priority;
  dueDate: string;
}
