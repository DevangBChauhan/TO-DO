import { useApp } from '../context/AppContext';
import {
  calcOverallProgress,
  getCurrentPhase,
  calcRoadmapHealth,
  calcStreak,
  calcNextAction,
  calcTodayStudyMinutes,
  calcExecutionRatio,
  calcRecoveryAdvice,
  formatMinutes,
  daysRemaining,
  currentWeekNumber,
  today,
  formatDate
} from '../utils/progressUtils';
import { buildReport } from '../utils/reportUtils';
import ReportConfig from '../components/report/ReportConfig';
import ReportPreview from '../components/report/ReportPreview';
import { useState } from 'react';

export default function Dashboard({ onNavigate }) {
  const contextData = useApp();
  const { roadmap, dailyTasks, focusSessions, settings } = contextData;
  const todayStr = today();

  const [showReportConfig, setShowReportConfig] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  function handleGenerateReport({ reportType, dateRange }) {
    const generated = buildReport(contextData, reportType, dateRange);
    setActiveReport(generated);
    setShowReportConfig(false);
  }

  // Real Dynamic Calculations
  const overallProgress = calcOverallProgress(roadmap);
  const currentPhase = getCurrentPhase(roadmap);
  const streak = calcStreak(dailyTasks, focusSessions);
  const nextAction = calcNextAction(roadmap, dailyTasks);
  const todayStudyMin = calcTodayStudyMinutes(focusSessions);
  const daysLeft = daysRemaining(settings.targetDate) ?? 126;
  const weekNum = currentWeekNumber(settings.startDate) || 4;
  const health = calcRoadmapHealth(roadmap, settings);
  const execRatio = calcExecutionRatio(focusSessions, dailyTasks);
  const recoveryInfo = calcRecoveryAdvice(roadmap, dailyTasks, focusSessions, settings);

  // Today's task telemetry
  const todayTasks = dailyTasks.filter(t => t.date === todayStr);
  const todayCompleted = todayTasks.filter(t => t.status === 'completed').length;
  const todayFocusCount = focusSessions.filter(s => s.date === todayStr).length;

  return (
    <div className="page-content" data-testid="dashboard">
      
      {/* ── Page Header ── */}
      <div className="page-title-wrap">
        <h1 className="page-main-title">Master Roadmap</h1>
        <p className="page-main-sub">Your exact path for becoming a strong Automation QA / SDET.</p>
      </div>

      {/* ── Top 4 Metric Cards ── */}
      <div className="grid-top-4">
        
        {/* 1. Overall Progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">OVERALL PROGRESS</span>
            <span style={{ color: 'var(--accent)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
            </span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 14 }}>
            {overallProgress}%
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>

        {/* 2. Current Phase */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">CURRENT PHASE</span>
            <span style={{ color: 'var(--text-muted)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 4 }}>
            Phase {currentPhase ? currentPhase.phaseNumber : 1}
          </div>
          <div className="stat-card-sub truncate">
            {currentPhase ? currentPhase.name : 'Java Foundation for Automation'}
          </div>
        </div>

        {/* 3. Status */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">STATUS</span>
            <span className="badge-working">
              {currentPhase?.status === 'completed' ? 'Completed' : 'Working'}
            </span>
          </div>
          <div className="stat-card-val">
            Week {weekNum} <span style={{ fontSize: '0.90rem', fontWeight: 500, color: 'var(--text-muted)' }}>of 20</span>
          </div>
        </div>

        {/* 4. Timeline */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span className="stat-card-title">TIMELINE</span>
            <span style={{ color: 'var(--text-muted)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
          </div>
          <div className="stat-card-val" style={{ marginBottom: 8 }}>
            {daysLeft} <span style={{ fontSize: '0.80rem', fontWeight: 500, color: 'var(--text-muted)' }}>days rem.</span>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '10px 0 6px' }} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
            Target: {settings.targetDate ? formatDate(settings.targetDate) : 'Jan 27'}
          </div>
        </div>

      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className="page-2col-grid">
        
        {/* LEFT COLUMN */}
        <div className="flex-col gap-lg">
          
          {/* Main Focus Card (Dynamic Next Action) */}
          <div className="card" style={{ border: '1px solid var(--accent-border)', padding: '24px', position: 'relative' }}>
            {/* Top Right Est Badge */}
            <div className="est-tag" style={{ position: 'absolute', top: 20, right: 20 }}>
              <div className="est-tag-label">Est.</div>
              <div className="est-tag-val">{nextAction ? (nextAction.estimatedMinutes || 45) + 'm' : '45m'}</div>
            </div>

            <div style={{ paddingRight: 80 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {nextAction ? nextAction.title : 'Collections — ArrayList'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24, maxWidth: '85%' }}>
                {nextAction?.source === 'today'
                  ? 'Focus on this high-priority planned task for today to maintain momentum.'
                  : 'Master core concepts and automation patterns. Key prerequisite for framework automation.'}
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary" onClick={() => onNavigate('focus')}>
                  Start Session
                </button>
                <button className="btn btn-outline" onClick={() => onNavigate(nextAction?.source === 'today' ? 'today' : 'roadmap')}>
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Lower Row: 2 Dynamic Cards Side-by-Side */}
          <div className="grid-2">
            
            {/* Left Card: Health & Pace */}
            <div className="card">
              <div className="stat-card-title" style={{ marginBottom: 14 }}>
                HEALTH &amp; PACE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: health.status === 'on-track' ? 'var(--green)' : health.status === 'slightly-behind' ? 'var(--accent)' : 'var(--red)' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {health.label || 'On Track'}
                </span>
              </div>
              <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {health.diff >= 0
                  ? `Pacing ${health.diff}% ahead of your planned progress baseline for SDET transition.`
                  : `Currently ${Math.abs(health.diff)}% behind baseline. Complete pending focus blocks to catch up.`}
              </p>
            </div>

            {/* Right Card: Dynamic Execution Metric */}
            <div className="card">
              <div className="stat-card-title" style={{ marginBottom: 14 }}>
                EXECUTION METRIC
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Execution (Coding)</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{execRatio.codingPct}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-card-inner)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', width: `${execRatio.codingPct}%`, background: 'var(--accent)' }} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Study (Reading/Video)</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{execRatio.studyPct}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--bg-card-inner)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ height: '100%', width: `${execRatio.studyPct}%`, background: '#475569' }} />
                </div>
              </div>

              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                {execRatio.codingPct >= 60
                  ? 'Ideal ratio: >60% Execution. You are optimizing well for practical skills.'
                  : 'Target: >60% Execution. Schedule more hands-on coding sessions.'}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-col gap-lg">
          
          {/* Card 1: Today's Protocol Widget (Real Dynamic) */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="stat-card-title">TODAY&apos;S PROTOCOL</span>
              <span style={{ color: 'var(--text-muted)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
            </div>

            <div className="protocol-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span>Tasks</span>
              </div>
              <span className="protocol-row-val">{todayCompleted} / {todayTasks.length || 4}</span>
            </div>

            <div className="protocol-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Study Time</span>
              </div>
              <span className="protocol-row-val">{formatMinutes(todayStudyMin)}</span>
            </div>

            <div className="protocol-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Focus</span>
              </div>
              <span className="protocol-row-val">{todayFocusCount} sessions</span>
            </div>

            <div className="streak-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>🔥</span>
                <span>Streak</span>
              </div>
              <span>{streak.current} Days</span>
            </div>

            <button className="btn-report" onClick={() => setShowReportConfig(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Generate Report
            </button>
          </div>

          {/* Card 2: Recovery Status (Dynamic) */}
          <div className="recovery-card" style={{ borderLeftColor: recoveryInfo.color }}>
            <div style={{ color: recoveryInfo.color, marginTop: 2 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                {recoveryInfo.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {recoveryInfo.advice}
              </div>
            </div>
          </div>

          {/* Card 3: Milestone Map (Dynamic from Roadmap State) */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 18 }}>
              MILESTONE MAP
            </div>

            <div className="milestone-list">
              {roadmap.map((phase) => {
                const isActive = phase.status === 'working' || (currentPhase && currentPhase.id === phase.id);
                const isCompleted = phase.status === 'completed';
                return (
                  <div key={phase.id} className="milestone-step" style={{ cursor: 'pointer' }} onClick={() => onNavigate('roadmap')}>
                    <div className={`milestone-dot ${isActive ? 'active' : ''}`} style={{ background: isCompleted ? 'var(--green)' : undefined, borderColor: isCompleted ? 'var(--green)' : undefined }} />
                    <div className="milestone-step-content">
                      <div className="milestone-step-phase" style={{ color: isActive ? 'var(--accent)' : isCompleted ? 'var(--green)' : 'var(--text-muted)' }}>
                        PHASE {phase.phaseNumber} {isCompleted ? '✓' : ''}
                      </div>
                      <div className="milestone-step-title" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {phase.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {showReportConfig && (
        <ReportConfig onGenerate={handleGenerateReport} onClose={() => setShowReportConfig(false)} />
      )}
      {activeReport && (
        <ReportPreview report={activeReport} onClose={() => setActiveReport(null)} />
      )}
    </div>
  );
}
