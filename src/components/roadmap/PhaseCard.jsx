import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calcPhaseProgress, getAllWeekTasks } from '../../utils/progressUtils';
import TaskItem from './TaskItem';

export default function PhaseCard({ phase }) {
  const { updatePhase, deletePhase, addWeek, updateWeek, deleteWeek, addRoadmapTask } = useApp();
  const [open, setOpen] = useState(true);
  const [editingPhase, setEditingPhase] = useState(false);
  const [phaseEdit, setPhaseEdit] = useState({
    name: phase.name,
    weeksRange: phase.weeksRange,
    status: phase.status,
    priority: phase.priority,
  });

  const [expandedWeekId, setExpandedWeekId] = useState(null);
  const [newTaskWeekId, setNewTaskWeekId] = useState(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('important');

  const [addingWeek, setAddingWeek] = useState(false);
  const [newWeekName, setNewWeekName] = useState('');

  const progress = calcPhaseProgress(phase);
  const allTasks = getAllWeekTasks(phase);
  const completedCount = allTasks.filter(t => t.completed).length;

  const isActivePhase = phase.status === 'working';
  const isDonePhase = phase.status === 'completed';

  function savePhaseEdit() {
    updatePhase(phase.id, phaseEdit);
    setEditingPhase(false);
  }

  function handleAddTask(weekId) {
    if (!newTaskName.trim()) return;
    addRoadmapTask(phase.id, weekId, { name: newTaskName.trim(), priority: newTaskPriority });
    setNewTaskName('');
    setNewTaskWeekId(null);
  }

  function handleAddWeek() {
    if (!newWeekName.trim()) return;
    addWeek(phase.id, { name: newWeekName.trim() });
    setNewWeekName('');
    setAddingWeek(false);
  }

  return (
    <div
      id={`phase-card-${phase.id}`}
      className={`card ${isActivePhase ? 'card-accent-border' : ''} mb-lg`}
      style={{ padding: '24px', transition: 'border-color 0.3s, box-shadow 0.3s' }}
    >
      
      {/* ── Phase Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: '#F59E0B', color: '#000', fontWeight: 800, padding: '3px 8px' }}>
            PHASE {String(phase.phaseNumber).padStart(2, '0')}
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {phase.name}
          </h2>
          <span className={`badge ${isActivePhase ? 'badge-accent' : isDonePhase ? 'badge-green' : 'badge-muted'}`}>
            {phase.status === 'working' ? 'IN-PROGRESS' : phase.status.replace('-', ' ')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            onClick={() => setEditingPhase(!editingPhase)}
            title="Edit Phase"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: 'var(--bg-input)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
            onClick={() => setOpen(!open)}
            title={open ? 'Collapse' : 'Expand'}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Subtitle row: Weeks range & Task count ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {phase.weeksRange || 'Weeks 1 - 4'}
        </div>
        <div style={{ color: 'var(--border-light)' }}>|</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          {completedCount}/{allTasks.length} Tasks
        </div>
      </div>

      {/* ── Phase Progress Bar ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-muted)' }}>PHASE PROGRESS</span>
          <span style={{ color: 'var(--accent)' }}>{progress}%</span>
        </div>
        <div className="progress-bar-wrap progress-sm">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* ── Edit Phase Form ── */}
      {editingPhase && (
        <div className="card mb-lg" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}>
          <div className="mono-label" style={{ marginBottom: 12 }}>Edit Phase Details</div>
          <div className="grid-2 mb-md">
            <div>
              <label className="mono-label" style={{ display: 'block', marginBottom: 4 }}>Name</label>
              <input
                className="input"
                value={phaseEdit.name}
                onChange={e => setPhaseEdit({ ...phaseEdit, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mono-label" style={{ display: 'block', marginBottom: 4 }}>Weeks Range</label>
              <input
                className="input"
                value={phaseEdit.weeksRange}
                onChange={e => setPhaseEdit({ ...phaseEdit, weeksRange: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-sm" style={{ color: 'var(--red)', border: '1px solid var(--border)' }} onClick={() => deletePhase(phase.id)}>
              Delete Phase
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setEditingPhase(false)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={savePhaseEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Weeks List ── */}
      {open && (
        <div className="flex-col gap-md">
          {phase.weeks.map(week => {
            const weekTasks = week.tasks || [];
            const weekDone = weekTasks.length > 0 && weekTasks.every(t => t.completed);
            const isWeekActive = !weekDone && weekTasks.some(t => !t.completed);
            const isExpanded = expandedWeekId === week.id;

            return (
              <div
                key={week.id}
                style={{
                  background: 'var(--bg-card)',
                  border: isWeekActive && isActivePhase ? '1px solid #F59E0B' : '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '16px 18px',
                  boxShadow: isWeekActive && isActivePhase ? '0 0 16px rgba(245, 158, 11, 0.10)' : 'none',
                  transition: 'all var(--t-fast)'
                }}
              >
                {/* Week Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flex: 1 }}
                    onClick={() => setExpandedWeekId(isExpanded ? null : week.id)}
                  >
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {week.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {weekDone && (
                      <span className="badge badge-green">DONE</span>
                    )}
                    {isWeekActive && (
                      <span className="badge badge-accent">ACTIVE</span>
                    )}
                    <button
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-input)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                      onClick={() => setExpandedWeekId(isExpanded ? null : week.id)}
                    >
                      {isExpanded ? 'Hide' : `${weekTasks.filter(t => t.completed).length}/${weekTasks.length} Tasks ▾`}
                    </button>
                  </div>
                </div>

                {/* Week Description / Summary */}
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.4 }}>
                  {week.description || weekTasks.map(t => t.name).slice(0, 3).join(', ') || 'Core foundation topics and exercises.'}
                </div>

                {/* Expanded Tasks Checklist */}
                {isExpanded && (
                  <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                    <div className="flex-col gap-sm">
                      {weekTasks.map(task => (
                        <TaskItem key={task.id} task={task} phaseId={phase.id} weekId={week.id} />
                      ))}
                    </div>

                    {/* Add Task inside Week */}
                    {newTaskWeekId === week.id ? (
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <input
                          className="input"
                          placeholder="Task title..."
                          value={newTaskName}
                          onChange={e => setNewTaskName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddTask(week.id)}
                          autoFocus
                        />
                        <button className="btn btn-primary btn-sm" onClick={() => handleAddTask(week.id)}>Add</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setNewTaskWeekId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button
                        style={{
                          marginTop: 10,
                          width: '100%',
                          padding: '7px',
                          fontSize: '0.75rem',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 600,
                          borderRadius: 4,
                          border: '1px dashed var(--border-light)',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                        onClick={() => setNewTaskWeekId(week.id)}
                      >
                        + Add Task to {week.name.split(':')[0]}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Week Button */}
          {addingWeek ? (
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <input
                className="input"
                placeholder="e.g. Week 5: Advanced Automation"
                value={newWeekName}
                onChange={e => setNewWeekName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddWeek()}
                autoFocus
              />
              <button className="btn btn-primary btn-sm" onClick={handleAddWeek}>Add Week</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setAddingWeek(false)}>Cancel</button>
            </div>
          ) : (
            <button
              className="btn btn-ghost btn-sm"
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)', width: '100%', marginTop: 4 }}
              onClick={() => setAddingWeek(true)}
            >
              + Add Week to Phase {phase.phaseNumber}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
