import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import tasksRoutes from "./routes/tasks.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "taskflow-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasksRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow API rodando em http://localhost:${PORT}`);
});
