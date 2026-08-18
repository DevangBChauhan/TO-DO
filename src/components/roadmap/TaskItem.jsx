import { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function TaskItem({ task, phaseId, weekId, compact = false }) {
  const { toggleRoadmapTask, updateRoadmapTask, deleteRoadmapTask } = useApp();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editPriority, setEditPriority] = useState(task.priority || 'important');

  function saveEdit() {
    if (editName.trim()) {
      updateRoadmapTask(phaseId, weekId, task.id, { name: editName.trim(), priority: editPriority });
    }
    setEditing(false);
  }

  const isCompleted = task.completed;

  if (editing) {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0' }}>
        <input
          className="input"
          style={{ flex: 1, padding: '5px 10px', fontSize: '0.82rem' }}
          value={editName}
          onChange={e => setEditName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
          autoFocus
        />
        <select
          className="select"
          style={{ width: 110, padding: '5px 8px', fontSize: '0.78rem' }}
          value={editPriority}
          onChange={e => setEditPriority(e.target.value)}
        >
          <option value="critical">Critical</option>
          <option value="important">Important</option>
          <option value="optional">Optional</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
        <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>✕</button>
      </div>
    );
  }

  const priorityColor = {
    critical: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.35)' },
    important: { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.35)' },
    optional: { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.08)', border: 'rgba(34, 197, 94, 0.35)' },
  }[task.priority] || { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.35)' };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        background: isCompleted ? 'rgba(0,0,0,0.06)' : 'var(--bg-input)',
        marginBottom: '6px',
        transition: 'all 0.15s ease'
      }}
      data-testid="task-item"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {/* Custom Square Checkbox */}
        <div
          onClick={() => toggleRoadmapTask(phaseId, weekId, task.id)}
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            border: isCompleted ? '1px solid #F59E0B' : '1px solid var(--border-light)',
            background: isCompleted ? '#F59E0B' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#000',
            fontSize: '0.70rem',
            fontWeight: 800,
            flexShrink: 0
          }}
          data-testid="complete-task"
          title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          {isCompleted && '✓'}
        </div>

        {/* Title */}
        <span
          style={{
            fontSize: '0.84rem',
            fontWeight: 500,
            color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {task.name}
        </span>
      </div>

      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Priority Pill */}
          <span
            style={{
              padding: '2px 7px',
              borderRadius: 3,
              fontSize: '0.62rem',
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: priorityColor.text,
              background: priorityColor.bg,
              border: `1px solid ${priorityColor.border}`
            }}
          >
            {task.priority || 'CRITICAL'}
          </span>

          {/* Edit Button */}
          <button
            onClick={() => setEditing(true)}
            title="Edit task"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              transition: 'color 0.15s'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => deleteRoadmapTask(phaseId, weekId, task.id)}
            title="Delete task"
            data-testid="delete-task"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              transition: 'color 0.15s'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
