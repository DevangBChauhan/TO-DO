import { useState } from 'react';
import { useApp } from '../../context/AppContext';

const STATUS_COLORS = {
  todo: 'var(--text-muted)',
  'in-progress': 'var(--accent)',
  completed: 'var(--green)',
  skipped: 'var(--red)',
};

const PRIORITY_COLORS = {
  high: 'var(--red)',
  medium: 'var(--accent)',
  low: 'var(--green)',
};

export default function TaskList({ tasks, showDate = false }) {
  const { completeDailyTask, updateDailyTask, deleteDailyTask } = useApp();
  const [expandedId, setExpandedId] = useState(null);

  if (tasks.length === 0) return null;

  function cycleStatus(task) {
    const cycle = { todo: 'in-progress', 'in-progress': 'completed', completed: 'skipped', skipped: 'todo' };
    const next = cycle[task.status] || 'todo';
    if (next === 'completed') {
      completeDailyTask(task.id);
    } else {
      updateDailyTask(task.id, { status: next });
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {tasks.map(task => {
        const isExpanded = expandedId === task.id;
        const statusColor = STATUS_COLORS[task.status] || 'var(--text-muted)';
        const priorityColor = PRIORITY_COLORS[task.priority] || 'var(--accent)';

        return (
          <div
            key={task.id}
            className="task-item"
            style={{
              flexDirection: 'column',
              opacity: task.status === 'skipped' ? 0.5 : 1,
              borderLeft: `3px solid ${priorityColor}`,
            }}
            data-testid="task-item"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
              {/* Status toggle */}
              <button
                onClick={() => cycleStatus(task)}
                style={{
                  width: 22, height: 22, borderRadius: 4, border: `2px solid ${statusColor}`,
                  background: task.status === 'completed' ? 'var(--green)' : task.status === 'in-progress' ? 'var(--accent-dim)' : 'transparent',
                  cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: '#fff',
                }}
                aria-label={`Status: ${task.status}. Click to cycle.`}
                data-testid="complete-task"
              >
                {task.status === 'completed' && '✓'}
                {task.status === 'in-progress' && '▶'}
                {task.status === 'skipped' && '–'}
              </button>

              <div
                className="flex-1"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpandedId(isExpanded ? null : task.id)}
              >
                <div className={`task-title${task.status === 'completed' ? ' strikethrough' : ''}`}>
                  {task.title}
                </div>
                <div className="task-meta">
                  <span style={{ color: priorityColor, textTransform: 'capitalize' }}>{task.priority}</span>
                  <span>{task.category}</span>
                  {task.estimatedMinutes && <span>~{task.estimatedMinutes}m</span>}
                  {showDate && <span>{task.date}</span>}
                </div>
              </div>

              <button
                className="btn btn-ghost btn-icon"
                onClick={() => { if (window.confirm('Delete this task?')) deleteDailyTask(task.id); }}
                aria-label="Delete task"
                data-testid="delete-task"
                style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 6, width: '100%', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {task.notes && <div style={{ marginBottom: 6 }}>📝 {task.notes}</div>}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {task.status !== 'completed' && (
                    <button className="btn btn-primary btn-sm" onClick={() => completeDailyTask(task.id)}>
                      ✓ Mark Complete
                    </button>
                  )}
                  <button className="btn btn-outline btn-sm" onClick={() => updateDailyTask(task.id, { status: 'skipped' })}>
                    Skip
                  </button>
                  {task.completedAt && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', alignSelf: 'center' }}>
                      Completed: {new Date(task.completedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
