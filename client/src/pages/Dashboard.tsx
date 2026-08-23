import { useEffect, useMemo, useState } from "react";
import { tasksApi } from "../api/api";
import { StatsPanel } from "../components/StatsPanel";
import { TaskCard } from "../components/TaskCard";
import { TaskFormModal } from "../components/TaskFormModal";
import { Stats, Task, TaskFormData } from "../types";

type FilterKey = "todas" | "pendentes" | "concluidas";

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("pendentes");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  async function loadData() {
    setLoading(true);
    const [taskList, statsData] = await Promise.all([
      tasksApi.list(),
      tasksApi.stats(),
    ]);
    setTasks(taskList);
    setStats(statsData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function refreshStats() {
    const statsData = await tasksApi.stats();
    setStats(statsData);
  }

  async function handleToggle(task: Task) {
    const updated = await tasksApi.update(task.id, { completed: !task.completed });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    refreshStats();
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Excluir a tarefa "${task.title}"?`)) return;
    await tasksApi.remove(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    refreshStats();
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleNew() {
    setEditingTask(null);
    setModalOpen(true);
  }

  async function handleFormSubmit(data: TaskFormData) {
    const payload = {
      ...data,
      dueDate: data.dueDate ? data.dueDate : null,
    };

    if (editingTask) {
      const updated = await tasksApi.update(editingTask.id, payload);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await tasksApi.create(payload);
      setTasks((prev) => [created, ...prev]);
    }

    setModalOpen(false);
    refreshStats();
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        if (filter === "pendentes") return !t.completed;
        if (filter === "concluidas") return t.completed;
        return true;
      })
      .filter((t) =>
        search.trim()
          ? t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.category.toLowerCase().includes(search.toLowerCase())
          : true
      );
  }, [tasks, filter, search]);

  return (
    <div className="dashboard">
      <StatsPanel stats={stats} />

      <div className="dashboard__toolbar">
        <div className="filters">
          {(["pendentes", "concluidas", "todas"] as FilterKey[]).map((key) => (
            <button
              key={key}
              className={`filter-btn ${filter === key ? "filter-btn--active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {key === "pendentes" && "Pendentes"}
              {key === "concluidas" && "Concluídas"}
              {key === "todas" && "Todas"}
            </button>
          ))}
        </div>

        <div className="dashboard__toolbar-right">
          <input
            className="search-input"
            type="search"
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn--primary" onClick={handleNew}>
            + Nova tarefa
          </button>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">Carregando tarefas...</div>
      ) : filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>Nenhuma tarefa encontrada.</p>
          <button className="btn btn--primary" onClick={handleNew}>
            Criar a primeira tarefa
          </button>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <TaskFormModal
          initialTask={editingTask}
          onClose={() => setModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
