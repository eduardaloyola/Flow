import axios from "axios";
import { Stats, Task, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
});

// Injeta o token JWT em toda requisição, se existir.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    api
      .post<AuthResponse>("/auth/register", { name, email, password })
      .then((r) => r.data),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }).then((r) => r.data),

  me: () => api.get<{ user: User }>("/auth/me").then((r) => r.data.user),
};

export const tasksApi = {
  list: () => api.get<{ tasks: Task[] }>("/tasks").then((r) => r.data.tasks),

  create: (data: Partial<Task>) =>
    api.post<{ task: Task }>("/tasks", data).then((r) => r.data.task),

  update: (id: string, data: Partial<Task>) =>
    api.patch<{ task: Task }>(`/tasks/${id}`, data).then((r) => r.data.task),

  remove: (id: string) => api.delete(`/tasks/${id}`),

  stats: () => api.get<Stats>("/tasks/stats/summary").then((r) => r.data),
};
