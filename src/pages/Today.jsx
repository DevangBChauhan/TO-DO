import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { today, formatMinutes, calcTodayStudyMinutes, calcStreak } from '../utils/progressUtils';
import TaskForm from '../components/tasks/TaskForm';

const INITIAL_DEMO_TASKS = [
  { id: 'demo-1', title: 'Review Selenium Grid architecture docs', category: 'LEARNING', priority: 'HIGH', estimatedMinutes: 45, timeSlot: '09:00', status: 'completed', date: today() },
  { id: 'demo-2', title: 'Implement Page Object Model in test suite', category: 'CODING', priority: 'HIGH', estimatedMinutes: 90, timeSlot: '10:30', status: 'todo', date: today() },
  { id: 'demo-3', title: 'Complete Leetcode Daily Challenge (Arrays)', category: 'PRACTICE', priority: 'MEDIUM', estimatedMinutes: 30, timeSlot: '13:00', status: 'todo', date: today() },
  { id: 'demo-4', title: 'Read chapter 4 of Clean Code', category: 'LEARNING', priority: 'LOW', estimatedMinutes: 45, timeSlot: '14:30', status: 'todo', date: today() },
];

export default function Today({ onNavigate }) {
  const { dailyTasks, focusSessions, toggleDailyTask, deleteDailyTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const todayStr = today();
  
  // Use current daily tasks or fallback to demo tasks if empty
  const rawTasks = dailyTasks.filter(t => t.date === todayStr);
  const activeTasksList = rawTasks.length > 0 ? rawTasks : INITIAL_DEMO_TASKS;

  const filteredTasks = activeTasksList.filter(t => {
    if (categoryFilter !== 'all' && t.category?.toLowerCase() !== categoryFilter) return false;
    if (priorityFilter !== 'all' && t.priority?.toLowerCase() !== priorityFilter) return false;
    return true;
  });

  const completed = activeTasksList.filter(t => t.status === 'completed').length;
  const todayStudyMin = calcTodayStudyMinutes(focusSessions);
  const todayFocusCount = focusSessions.filter(s => s.date === todayStr).length;
  const streak = calcStreak(dailyTasks, focusSessions);

  // Dynamic Schedule Blocks derived from tasks
  const scheduleSlots = ['09:00', '10:30', '13:00', '14:30', '16:30'];
  const scheduledBlocks = activeTasksList.map((task, idx) => ({
    ...task,
    time: task.timeSlot || scheduleSlots[idx % scheduleSlots.length],
  })).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="page-content" data-testid="today">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title">Today&apos;s Protocol</h1>
            <span className="badge badge-muted" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.70rem', padding: '3px 8px' }}>
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </span>
          </div>
          <p className="page-subtitle">Execute daily deliberate practice blocks and monitor precision metrics.</p>
        </div>
      </div>

      {/* ── Top 4 Stat Cards ── */}
      <div className="grid-top-4">
        {/* 1. Completed Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">COMPLETED TASKS</span>
            <span style={{ color: '#F59E0B' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="16 12 12 8 8 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 10 }}>
            {completed} <span style={{ fontSize: '0.90rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {activeTasksList.length}</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${activeTasksList.length > 0 ? (completed / activeTasksList.length) * 100 : 0}%` }} />
          </div>
        </div>

        {/* 2. Study Time */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">STUDY TIME</span>
            <span style={{ color: 'var(--text-muted)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 6 }}>
            {formatMinutes(todayStudyMin) || '0m'}
          </div>
          <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
            TARGET: 2h 30m
          </div>
        </div>

        {/* 3. Focus Sessions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">FOCUS SESSIONS</span>
            <span style={{ color: 'var(--text-muted)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 10 }}>
            {todayFocusCount}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: n <= todayFocusCount ? '#F59E0B' : 'var(--border)'
                }}
              />
            ))}
          </div>
        </div>

        {/* 4. Current Streak */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">CURRENT STREAK</span>
            <span style={{ color: '#F59E0B' }}>🔥</span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 6 }}>
            {streak.current} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>days</span>
          </div>
          <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
            Best: {streak.best} days
          </div>
        </div>
      </div>

      {/* ── Add Task Form Modal ── */}
      {showForm && (
        <TaskForm onClose={() => setShowForm(false)} />
      )}

      {/* ── Main 2-Column Grid ── */}
      <div className="page-2col-grid">
        
        {/* LEFT COLUMN: Filters + Tasks List */}
        <div>
          {/* Filters & Add Task Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="filter-pill">
                <span>Category:</span>
                <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="coding">Coding</option>
                  <option value="learning">Learning</option>
                  <option value="practice">Practice</option>
                </select>
                <span className="filter-pill-arrow">▾</span>
              </div>

              <div className="filter-pill">
                <span>Priority:</span>
                <select className="filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <span className="filter-pill-arrow">▾</span>
              </div>
            </div>

            <button className="btn-add-task" onClick={() => setShowForm(true)} data-testid="add-task">
              + Add Task
            </button>
          </div>

          {/* Tasks List Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="flex-col">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const pColor = {
                  HIGH: { text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' },
                  CRITICAL: { text: '#ef4444', border: 'rgba(239, 68, 68, 0.4)' },
                  MEDIUM: { text: '#F59E0B', border: 'rgba(245, 158, 11, 0.4)' },
                  LOW: { text: '#94a3b8', border: 'var(--border)' },
                }[(task.priority || 'HIGH').toUpperCase()] || { text: '#F59E0B', border: 'rgba(245, 158, 11, 0.4)' };

                return (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderBottom: '1px solid var(--border)',
                      background: isCompleted ? 'rgba(0,0,0,0.04)' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                      {/* Custom Square Checkbox */}
                      <div
                        onClick={() => toggleDailyTask(task.id)}
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 3,
                          border: isCompleted ? '1px solid #F59E0B' : '1.5px solid var(--border-light)',
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
                      >
                        {isCompleted && '✓'}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {task.title}
                        </div>

                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: 3,
                              border: '1px solid var(--border)',
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '0.58rem',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {(task.category || 'LEARNING').toUpperCase()}
                          </span>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: 3,
                              border: `1px solid ${pColor.border}`,
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '0.58rem',
                              color: pColor.text,
                              fontWeight: 700
                            }}
                          >
                            {(task.priority || 'HIGH').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                        {task.estimatedMinutes ? `${task.estimatedMinutes}m` : '45m'}
                      </div>
                      <button
                        className="header-icon-btn"
                        style={{ width: 22, height: 22, fontSize: '0.70rem', color: 'var(--text-muted)' }}
                        onClick={() => deleteDailyTask(task.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No tasks found for this filter.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dynamic Today's Schedule Timeline */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Today&apos;s Schedule
              </div>
              <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                {scheduledBlocks.length} planned block{scheduledBlocks.length === 1 ? '' : 's'}
              </div>
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setShowForm(true)} style={{ padding: '3px 8px', fontSize: '0.70rem' }}>
              + Slot
            </button>
          </div>

          {/* Dynamic Vertical Schedule Timeline */}
          <div className="flex-col gap-md">
            {scheduledBlocks.map((block, idx) => {
              const isBlockDone = block.status === 'completed';
              const isCurrent = !isBlockDone && (idx === 0 || scheduledBlocks[idx - 1]?.status === 'completed');

              return (
                <div key={block.id || idx} style={{ display: 'flex', gap: 12 }}>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: isCurrent ? '#F59E0B' : 'var(--text-muted)',
                      width: 42,
                      paddingTop: 6,
                      fontWeight: isCurrent ? 700 : 500
                    }}
                  >
                    {block.time}
                  </div>

                  <div
                    onClick={() => onNavigate && onNavigate('focus')}
                    style={{
                      flex: 1,
                      padding: isCurrent ? '12px 14px' : '10px 14px',
                      background: isCurrent ? 'var(--bg-card)' : 'var(--bg-input)',
                      border: isCurrent ? '1px solid #F59E0B' : '1px solid var(--border)',
                      borderRadius: 6,
                      boxShadow: isCurrent ? '0 0 16px rgba(245, 158, 11, 0.12)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    title="Click to start focus session"
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <div
                        style={{
                          fontSize: '0.58rem',
                          fontFamily: 'JetBrains Mono, monospace',
                          color: isCurrent ? '#F59E0B' : 'var(--text-muted)',
                          fontWeight: 700
                        }}
                      >
                        {(block.category || 'LEARNING').toUpperCase()} {isCurrent ? '[ACTUAL]' : isBlockDone ? '[DONE]' : ''}
                      </div>

                      {isBlockDone && <span style={{ fontSize: '0.65rem', color: 'var(--green)' }}>✓</span>}
                    </div>

                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: isCurrent ? 700 : 600,
                        color: isBlockDone ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: isBlockDone ? 'line-through' : 'none',
                        marginBottom: isCurrent ? 8 : 0
                      }}
                    >
                      {block.title}
                    </div>

                    {isCurrent && (
                      <div className="progress-bar-wrap" style={{ height: 4 }}>
                        <div className="progress-bar-fill" style={{ width: '50%' }} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
