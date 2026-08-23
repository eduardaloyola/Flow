import { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR");
}

function isOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className={`task-card ${task.completed ? "task-card--done" : ""}`}>
      <button
        className="task-card__checkbox"
        onClick={() => onToggle(task)}
        aria-label="Marcar como concluída"
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-card__content">
        <div className="task-card__top">
          <h3 className="task-card__title">{task.title}</h3>
          <span className={`badge badge--${task.priority}`}>
            {PRIORITY_LABEL[task.priority]}
          </span>
        </div>

        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}

        <div className="task-card__meta">
          <span className="tag">{task.category}</span>
          {task.dueDate && (
            <span className={`due-date ${isOverdue(task) ? "due-date--overdue" : ""}`}>
              📅 {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-card__actions">
        <button className="icon-btn" onClick={() => onEdit(task)} title="Editar">
          ✎
        </button>
        <button className="icon-btn" onClick={() => onDelete(task)} title="Excluir">
          🗑
        </button>
      </div>
    </div>
  );
}
