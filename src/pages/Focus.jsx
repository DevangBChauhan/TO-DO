import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { today, formatMinutes, calcTodayStudyMinutes } from '../utils/progressUtils';
import SessionComplete from '../components/timer/SessionComplete';

const PRESETS = [
  { id: 'pomodoro',  label: 'Classic Pomodoro', sub: '25m focus / 5m break', work: 25, shortBreak: 5, sessions: 4 },
  { id: 'deepwork',  label: 'Deep Work',        sub: '50m focus / 10m break', work: 50, shortBreak: 10, sessions: 2 },
  { id: 'longfocus', label: 'Long Focus',        sub: '90m focus / 15m break', work: 90, shortBreak: 15, sessions: 2 },
  { id: 'custom',    label: 'Custom Timing',     sub: 'Set own duration',       work: 30, shortBreak: 5, sessions: 4 },
];

export default function Focus() {
  const { dailyTasks, addFocusSession, updateFocusSession, focusSessions } = useApp();

  // Clock Modes: 'timer' | 'stopwatch' | 'break'
  const [clockMode, setClockMode] = useState('timer');
  const [preset, setPreset] = useState('pomodoro');
  
  // Custom timer settings
  const [customWorkMin, setCustomWorkMin] = useState(30);
  const [customBreakMin, setCustomBreakMin] = useState(5);
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  // Timer State
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const intervalRef = useRef(null);
  const currentPreset = PRESETS.find(p => p.id === preset) || PRESETS[0];
  const workMin = preset === 'custom' ? customWorkMin : currentPreset.work;
  const breakMin = preset === 'custom' ? customBreakMin : currentPreset.shortBreak;

  const todayTasks = dailyTasks.filter(t => t.date === today() && t.status !== 'completed');
  const todayStudyMin = calcTodayStudyMinutes(focusSessions);
  const todaySessionCount = focusSessions.filter(s => s.date === today()).length;

  // Sound Chime using Web Audio API
  function playChime() {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio chime not supported:', e);
    }
  }

  // Interval Loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (clockMode === 'stopwatch') {
          setStopwatchSeconds(s => s + 1);
        } else {
          setSecondsLeft(s => {
            if (s <= 1) {
              clearInterval(intervalRef.current);
              handleComplete();
              return 0;
            }
            return s - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, clockMode]);

  function handleComplete() {
    setIsRunning(false);
    playChime();
    setShowComplete(true);
    if (currentSessionId) {
      updateFocusSession(currentSessionId, { completedMinutes: workMin });
    }
  }

  function handlePresetChange(pId) {
    setPreset(pId);
    if (pId === 'custom') {
      setShowCustomEditor(true);
    } else {
      setShowCustomEditor(false);
    }
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setClockMode('timer');
    const p = PRESETS.find(pr => pr.id === pId) || PRESETS[0];
    const mins = pId === 'custom' ? customWorkMin : p.work;
    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setCurrentSessionId(null);
  }

  function handleModeTabChange(mode) {
    setClockMode(mode);
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (mode === 'timer') {
      const secs = workMin * 60;
      setTotalSeconds(secs);
      setSecondsLeft(secs);
    } else if (mode === 'break') {
      const secs = breakMin * 60;
      setTotalSeconds(secs);
      setSecondsLeft(secs);
    } else if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
    }
  }

  function applyCustomDuration(mins) {
    setCustomWorkMin(mins);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
    setIsRunning(false);
  }

  function start() {
    if (clockMode !== 'stopwatch' && secondsLeft <= 0) return;
    if (clockMode === 'timer' && !currentSessionId) {
      const task = todayTasks.find(t => t.id === selectedTask);
      const sessionId = addFocusSession({
        date: today(),
        taskId: selectedTask || null,
        taskTitle: task ? task.title : 'Free Study',
        sessionType: preset,
        plannedMinutes: workMin,
        startedAt: new Date().toISOString(),
      }).id;
      setCurrentSessionId(sessionId);
    }
    setIsRunning(true);
  }

  function pause() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    if (clockMode === 'stopwatch') {
      setStopwatchSeconds(0);
    } else if (clockMode === 'break') {
      const secs = breakMin * 60;
      setSecondsLeft(secs);
      setTotalSeconds(secs);
    } else {
      const secs = workMin * 60;
      setSecondsLeft(secs);
      setTotalSeconds(secs);
    }
  }

  // Time strings
  let displayMins = 0;
  let displaySecs = 0;
  let progressPct = 0;

  if (clockMode === 'stopwatch') {
    displayMins = Math.floor(stopwatchSeconds / 60);
    displaySecs = stopwatchSeconds % 60;
    progressPct = ((stopwatchSeconds % 3600) / 3600) * 100;
  } else {
    displayMins = Math.floor(secondsLeft / 60);
    displaySecs = secondsLeft % 60;
    progressPct = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  }

  const timeStr = `${String(displayMins).padStart(2, '0')}:${String(displaySecs).padStart(2, '0')}`;

  return (
    <div className="page-content" data-testid="focus">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Focus Timer &amp; Clock</h1>
          <p className="page-subtitle">Structured deep work blocks, stopwatch flow, and deliberate practice clock.</p>
        </div>

        {/* Header Controls: Sound & Fullscreen */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="filter-pill"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
          >
            {soundEnabled ? '🔔 Sound On' : '🔕 Sound Off'}
          </button>
          <button
            className="filter-pill"
            onClick={() => setIsFullScreen(!isFullScreen)}
            title="Toggle Distraction-Free Mode"
          >
            {isFullScreen ? '↙ Exit Focus' : '↗ Fullscreen'}
          </button>
        </div>
      </div>

      {/* ── Clock Mode Tabs ── */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        <button
          className={`tab-btn ${clockMode === 'timer' ? 'active' : ''}`}
          onClick={() => handleModeTabChange('timer')}
        >
          ⏱ Countdown Timer
        </button>
        <button
          className={`tab-btn ${clockMode === 'stopwatch' ? 'active' : ''}`}
          onClick={() => handleModeTabChange('stopwatch')}
        >
          ⏳ Stopwatch / Flow
        </button>
        <button
          className={`tab-btn ${clockMode === 'break' ? 'active' : ''}`}
          onClick={() => handleModeTabChange('break')}
        >
          ☕ Rest &amp; Break ({breakMin}m)
        </button>
      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className={isFullScreen ? '' : 'page-2col-grid'}>
        
        {/* LEFT COLUMN: Large Timer Card */}
        <div
          className="card"
          style={{
            padding: '32px 36px',
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: isRunning ? '1px solid var(--accent)' : '1px solid var(--border)',
            boxShadow: isRunning ? '0 0 24px rgba(245, 158, 11, 0.10)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Top Row: Objective Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="stat-card-title">
                {clockMode === 'break' ? 'CURRENT REST PERIOD' : 'CURRENT OBJECTIVE'}
              </span>
              <span className="badge-working" style={{ fontSize: '0.65rem' }}>
                {isRunning ? (clockMode === 'stopwatch' ? 'FLOWING' : 'FOCUSING') : 'PAUSED'}
              </span>
            </div>

            <div className="filter-pill" style={{ width: '100%', padding: '10px 14px' }}>
              <select
                className="filter-select"
                value={selectedTask}
                onChange={e => setSelectedTask(e.target.value)}
                style={{ width: '100%', fontSize: '0.88rem', fontWeight: 600 }}
              >
                <option value="">Mastering Playwright Fixtures</option>
                {todayTasks.map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
                <option value="free">Free Study / Practice</option>
              </select>
              <span className="filter-pill-arrow" style={{ right: 14, fontSize: '0.80rem' }}>▾</span>
            </div>
          </div>

          {/* Centered Giant Digits & Progress */}
          <div style={{ margin: '36px 0', textAlign: 'center' }}>
            <div className="timer-big-digits">
              {timeStr}
            </div>

            {/* Horizontal Gold Progress Line */}
            <div style={{ width: '100%', maxWidth: 460, height: 6, background: 'var(--border)', borderRadius: 3, margin: '0 auto 32px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPct || 100}%`,
                  background: clockMode === 'break' ? 'var(--blue)' : 'var(--accent)',
                  transition: 'width 1s linear'
                }}
              />
            </div>

            {/* Controls Row */}
            <div className="timer-controls">
              <button className="timer-btn-sq" onClick={pause} disabled={!isRunning} title="Pause">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              </button>

              <button
                className="timer-btn-play"
                onClick={isRunning ? pause : start}
                title={isRunning ? 'Pause' : 'Start'}
              >
                {isRunning ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              <button className="timer-btn-sq" onClick={reset} title="Reset">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom Quick Preset Pills (Inside Timer Card) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[15, 25, 45, 60, 90].map(mins => (
              <button
                key={mins}
                onClick={() => {
                  handlePresetChange('custom');
                  applyCustomDuration(mins);
                }}
                style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  border: '1px solid var(--border)',
                  background: workMin === mins && clockMode === 'timer' ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-input)',
                  color: workMin === mins && clockMode === 'timer' ? 'var(--accent)' : 'var(--text-secondary)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Presets, Customizer & Telemetry */}
        {!isFullScreen && (
          <div className="flex-col gap-lg">
            
            {/* Card 1: Session Presets */}
            <div className="card">
              <div className="stat-card-title" style={{ marginBottom: 14 }}>
                SESSION PRESETS
              </div>

              <div className="flex-col gap-sm">
                {PRESETS.map(p => {
                  const isActive = preset === p.id && clockMode === 'timer';
                  return (
                    <div
                      key={p.id}
                      onClick={() => handlePresetChange(p.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: 6,
                        border: isActive ? '1px solid #F59E0B' : '1px solid var(--border)',
                        background: isActive ? 'rgba(245, 158, 11, 0.06)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: '0.68rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', marginTop: 2 }}>
                          {p.id === 'custom' ? `${customWorkMin}m focus / ${customBreakMin}m break` : p.sub}
                        </div>
                      </div>

                      {isActive && (
                        <div style={{ color: '#F59E0B' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="16 12 12 8 8 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Inline Customizer Form */}
              {showCustomEditor && (
                <div style={{ marginTop: 14, padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <div className="stat-card-title" style={{ fontSize: '0.62rem', marginBottom: 8 }}>
                    CUSTOM MINUTES
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="number"
                      min={1}
                      max={180}
                      className="input"
                      value={customWorkMin}
                      onChange={e => applyCustomDuration(Math.max(1, Number(e.target.value)))}
                      style={{ padding: '6px 10px', fontSize: '0.82rem', fontFamily: 'JetBrains Mono, monospace' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>minutes</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Daily Telemetry */}
            <div className="card">
              <div className="stat-card-title" style={{ marginBottom: 14 }}>
                DAILY TELEMETRY
              </div>

              <div className="grid-2 mb-md">
                <div className="stat-box">
                  <div className="stat-card-title" style={{ fontSize: '0.62rem' }}>FOCUS TIME</div>
                  <div className="stat-card-val" style={{ fontSize: '1.3rem', marginTop: 4 }}>
                    {formatMinutes(todayStudyMin) || '2h 15m'}
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-card-title" style={{ fontSize: '0.62rem' }}>SESSIONS</div>
                  <div className="stat-card-val" style={{ fontSize: '1.3rem', marginTop: 4 }}>
                    {todaySessionCount || 4} / 8
                  </div>
                </div>
              </div>

              <div className="stat-card-title" style={{ fontSize: '0.60rem', marginBottom: 8 }}>
                SESSION FLOW
              </div>
              <div className="session-flow-grid">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div
                    key={n}
                    className={`session-flow-block ${n <= (todaySessionCount || 4) ? 'active' : n === 5 ? 'partial' : ''}`}
                  />
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {showComplete && (
        <SessionComplete
          session={{ plannedMinutes: workMin, completedMinutes: workMin }}
          onClose={() => setShowComplete(false)}
        />
      )}
    </div>
  );
}
