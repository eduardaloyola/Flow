import { Stats } from "../types";

export function StatsPanel({ stats }: { stats: Stats | null }) {
  if (!stats) return null;

  const cards = [
    { label: "Total de tarefas", value: stats.total, tone: "neutral" },
    { label: "Concluídas", value: stats.completed, tone: "success" },
    { label: "Pendentes", value: stats.pending, tone: "warning" },
    { label: "Atrasadas", value: stats.overdue, tone: "danger" },
  ];

  return (
    <section className="stats-panel">
      <div className="stats-panel__cards">
        {cards.map((c) => (
          <div key={c.label} className={`stat-card stat-card--${c.tone}`}>
            <span className="stat-card__value">{c.value}</span>
            <span className="stat-card__label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="stats-panel__progress">
        <div className="progress-header">
          <span>Taxa de conclusão</span>
          <strong>{stats.completionRate}%</strong>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar__fill"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>
    </section>
  );
}
