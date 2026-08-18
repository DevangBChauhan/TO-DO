import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  calcOverallProgress,
  calcCompletedRoadmapTasks,
  calcTotalRoadmapTasks,
  getCurrentPhase,
  weeksRemaining
} from '../utils/progressUtils';
import PhaseCard from '../components/roadmap/PhaseCard';

export default function Roadmap() {
  const { roadmap, addPhase, settings } = useApp();
  const overallProgress = calcOverallProgress(roadmap);
  const currentPhase = getCurrentPhase(roadmap);
  const weeksLeft = weeksRemaining(settings.targetDate) ?? 18;

  const [addingPhase, setAddingPhase] = useState(false);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newPhaseWeeks, setNewPhaseWeeks] = useState('');

  function handleCreatePhase() {
    if (!newPhaseName.trim()) return;
    addPhase({
      name: newPhaseName.trim(),
      phaseNumber: roadmap.length + 1,
      weeksRange: newPhaseWeeks.trim() || `Weeks ${roadmap.length * 4 + 1} - ${(roadmap.length + 1) * 4}`,
      weeks: []
    });
    setNewPhaseName('');
    setNewPhaseWeeks('');
    setAddingPhase(false);
  }

  return (
    <div className="page-content" data-testid="roadmap">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Roadmap Management</h1>
          <p className="page-subtitle">Structure and track the 5-month learning sequence from QA to SDET.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setAddingPhase(true)}
          style={{ padding: '8px 18px', fontWeight: 700 }}
        >
          + Add Phase
        </button>
      </div>

      {/* ── Add Phase Modal / Card ── */}
      {addingPhase && (
        <div className="card mb-lg card-accent-border">
          <div className="mono-label" style={{ marginBottom: 12 }}>Create New Roadmap Phase</div>
          <div className="grid-2 mb-md">
            <div>
              <label className="mono-label" style={{ display: 'block', marginBottom: 4 }}>Phase Title</label>
              <input
                className="input"
                placeholder="e.g. CI/CD & Test Automation Frameworks"
                value={newPhaseName}
                onChange={e => setNewPhaseName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="mono-label" style={{ display: 'block', marginBottom: 4 }}>Weeks Range</label>
              <input
                className="input"
                placeholder="e.g. Weeks 17 - 20"
                value={newPhaseWeeks}
                onChange={e => setNewPhaseWeeks(e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => setAddingPhase(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleCreatePhase}>Create Phase</button>
          </div>
        </div>
      )}

      {/* ── Main 2-Column Grid (Figma layout: Left Directory, Right Phases) ── */}
      <div className="roadmap-grid">
        
        {/* LEFT COLUMN: Journey Overview & Phase Directory */}
        <div className="flex-col gap-lg">
          
          {/* Card 1: Journey Overview */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ color: '#F59E0B' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Journey Overview
              </div>
            </div>

            {/* Total Progress */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.70rem', fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>TOTAL PROGRESS</span>
                <span style={{ color: '#F59E0B' }}>{overallProgress}%</span>
              </div>
              <div className="progress-bar-wrap progress-sm">
                <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
              </div>
            </div>

            {/* 2 Stat Boxes */}
            <div className="grid-2">
              <div className="stat-box">
                <div className="stat-box-label">CURRENT PHASE</div>
                <div className="stat-box-num" style={{ fontSize: '1.5rem', marginTop: 4 }}>
                  {currentPhase ? currentPhase.phaseNumber : '✓'}
                </div>
              </div>
              <div className="stat-box">
                <div className="stat-box-label">WEEKS REMAINING</div>
                <div className="stat-box-num" style={{ fontSize: '1.5rem', marginTop: 4 }}>
                  {weeksLeft}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Phase Directory */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 16 }}>
              PHASE DIRECTORY
            </div>

            <div className="flex-col gap-sm" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}>
              {roadmap.map(phase => {
                const isActive = phase.status === 'working' || (currentPhase && currentPhase.id === phase.id);
                return (
                  <div
                    key={phase.id}
                    onClick={() => {
                      const el = document.getElementById(`phase-card-${phase.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: isActive ? '#F59E0B' : 'var(--text-secondary)',
                      fontWeight: isActive ? 700 : 500,
                      padding: '6px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      background: isActive ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ color: isActive ? '#F59E0B' : 'var(--text-muted)', fontSize: '0.7rem' }}>
                      {isActive ? '●' : '○'}
                    </span>
                    <span className="truncate">
                      {phase.phaseNumber}. {phase.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Full Phase List */}
        <div>
          <div className="flex-col gap-lg">
            {roadmap.map(phase => (
              <PhaseCard key={phase.id} phase={phase} />
            ))}
          </div>

          {roadmap.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🗺️</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>No roadmap phases yet</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Add your first SDET learning phase to start tracking.
              </div>
              <button className="btn btn-primary" onClick={() => setAddingPhase(true)}>+ Add Phase</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
