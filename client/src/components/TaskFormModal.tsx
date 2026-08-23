import { FormEvent, useEffect, useState } from "react";
import { Priority, Task, TaskFormData } from "../types";

interface Props {
  initialTask: Task | null;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

const EMPTY_FORM: TaskFormData = {
  title: "",
  description: "",
  category: "Geral",
  priority: "media",
  dueDate: "",
};

export function TaskFormModal({ initialTask, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialTask) {
      setForm({
        title: initialTask.title,
        description: initialTask.description,
        category: initialTask.category,
        priority: initialTask.priority,
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialTask]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("O título é obrigatório.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
    } catch {
      setError("Não foi possível salvar a tarefa. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{initialTask ? "Editar tarefa" : "Nova tarefa"}</h2>

        <form onSubmit={handleSubmit} className="task-form">
          <label>
            Título
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Estudar para a prova"
              autoFocus
            />
          </label>

          <label>
            Descrição
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detalhes opcionais..."
              rows={3}
            />
          </label>

          <div className="task-form__row">
            <label>
              Categoria
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Ex: Estudos, Trabalho..."
              />
            </label>

            <label>
              Prioridade
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as Priority })
                }
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </label>
          </div>

          <label>
            Data limite
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="task-form__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
