import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  calcOverallProgress, calcCompletedRoadmapTasks, calcTotalRoadmapTasks,
  calcStreak, calcTotalStudyMinutes, calcWeekStudyMinutes,
  formatMinutes
} from '../utils/progressUtils';
import WeeklyReview from '../components/progress/WeeklyReview';
import StreakCalendar from '../components/progress/StreakCalendar';

export default function Progress() {
  const { roadmap, dailyTasks, focusSessions } = useApp();
  const [tab, setTab] = useState('overview');

  const overallProgress = calcOverallProgress(roadmap);
  const completedTasks = calcCompletedRoadmapTasks(roadmap);
  const totalTasks = calcTotalRoadmapTasks(roadmap);
  const streak = calcStreak(dailyTasks, focusSessions);
  const totalStudy = calcTotalStudyMinutes(focusSessions);
  const weekStudy = calcWeekStudyMinutes(focusSessions);

  return (
    <div className="page-content" data-testid="progress">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Progress &amp; Analytics</h1>
          <p className="page-subtitle">Your execution metrics — honest, transparent, actionable.</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs">
        <button className={`tab-btn ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}>
          Overview
        </button>
        <button className={`tab-btn ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>
          Weekly Review
        </button>
        <button className={`tab-btn ${tab === 'roadmap' ? 'active' : ''}`} onClick={() => setTab('roadmap')}>
          Phase Breakdown
        </button>
      </div>

      {tab === 'overview' && (
        <div className="flex-col gap-lg">
          {/* Top 4 Stat Cards */}
          <div className="grid-top-4">
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="stat-card-title">ROADMAP PROGRESS</span>
                <span style={{ color: 'var(--accent)' }}>📈</span>
              </div>
              <div className="stat-card-val" style={{ marginBottom: 10 }}>{overallProgress}%</div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

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

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="stat-card-title">TOTAL STUDY TIME</span>
                <span style={{ color: 'var(--text-muted)' }}>⏱</span>
              </div>
              <div className="stat-card-val" style={{ marginBottom: 6 }}>
                {formatMinutes(totalStudy)}
              </div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                This week: {formatMinutes(weekStudy)}
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span className="stat-card-title">TASKS COMPLETED</span>
                <span style={{ color: 'var(--text-muted)' }}>✓</span>
              </div>
              <div className="stat-card-val" style={{ marginBottom: 6 }}>
                {completedTasks} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {totalTasks}</span>
              </div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                Across all roadmap phases
              </div>
            </div>
          </div>

          {/* Overall Roadmap Progress Detailed Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Overall Roadmap Progress
                </div>
                <div style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {completedTasks} of {totalTasks} tasks completed
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace' }}>
                {overallProgress}%
              </div>
            </div>
            <div className="progress-bar-wrap" style={{ height: 8 }}>
              <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>

          {/* 28-Day Heatmap Activity */}
          <div className="card">
            <div className="section-title">
              <span>Activity — Last 28 Days</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>
                (completed task or focus session = active day)
              </span>
            </div>
            <StreakCalendar dailyTasks={dailyTasks} focusSessions={focusSessions} />
          </div>
        </div>
      )}

      {tab === 'weekly' && (
        <WeeklyReview />
      )}

      {tab === 'roadmap' && (
        <div className="flex-col gap-md">
          {roadmap.map(phase => {
            const allTasks = phase.weeks.flatMap(w => w.tasks || []);
            const completed = allTasks.filter(t => t.completed).length;
            const pct = allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;
            return (
              <div key={phase.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <span className="badge" style={{ background: '#F59E0B', color: '#000', fontWeight: 800, marginRight: 8, fontSize: '0.65rem' }}>
                      PHASE {phase.phaseNumber}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{phase.name}</span>
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--accent)' }}>
                    {pct}% ({completed}/{allTasks.length})
                  </span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
