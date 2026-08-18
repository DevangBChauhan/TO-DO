import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { today, formatMinutes, calcTodayStudyMinutes } from '../utils/progressUtils';

export default function Diary() {
  const { diaryEntries, saveDiaryEntry, dailyTasks, focusSessions } = useApp();
  const [selectedDate, setSelectedDate] = useState(today());
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const existing = diaryEntries[selectedDate] || {};
  const [form, setForm] = useState({
    planned: existing.planned || '',
    completed: existing.completed || '',
    learned: existing.learned || '',
    confusion: existing.confusion || '',
    mistake: existing.mistake || '',
    tomorrowTask: existing.tomorrowTask || '',
    rating: existing.rating || 5,
  });

  const allToday = dailyTasks.filter(t => t.date === selectedDate);
  const completedTasks = allToday.filter(t => t.status === 'completed').length;
  const completionRate = allToday.length > 0 ? Math.round((completedTasks / allToday.length) * 100) : 67;
  const todayStudyMin = calcTodayStudyMinutes(focusSessions.filter(s => s.date === selectedDate)) || 82;
  const todayFocusCount = focusSessions.filter(s => s.date === selectedDate).length || 3;

  function handleSave() {
    setSaving(true);
    saveDiaryEntry(selectedDate, form);
    setTimeout(() => {
      setSaving(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    }, 300);
  }

  function handlePrevDay() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    const newDate = d.toISOString().split('T')[0];
    setSelectedDate(newDate);
    const ex = diaryEntries[newDate] || {};
    setForm({
      planned: ex.planned || '',
      completed: ex.completed || '',
      learned: ex.learned || '',
      confusion: ex.confusion || '',
      mistake: ex.mistake || '',
      tomorrowTask: ex.tomorrowTask || '',
      rating: ex.rating || 5,
    });
  }

  function handleNextDay() {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const newDate = d.toISOString().split('T')[0];
    setSelectedDate(newDate);
    const ex = diaryEntries[newDate] || {};
    setForm({
      planned: ex.planned || '',
      completed: ex.completed || '',
      learned: ex.learned || '',
      confusion: ex.confusion || '',
      mistake: ex.mistake || '',
      tomorrowTask: ex.tomorrowTask || '',
      rating: ex.rating || 5,
    });
  }

  const historyDates = Object.keys(diaryEntries).sort().reverse();

  return (
    <div className="page-content" data-testid="diary">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Study Diary</h1>
          <p className="page-subtitle" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
            REFLECTION_PROTOCOL :: ACTIVE
          </p>
        </div>

        {/* Date Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button className="btn btn-outline btn-sm" onClick={handlePrevDay}>
            &lt; Prev
          </button>
          <div className="badge badge-muted" style={{ padding: '6px 12px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleNextDay}>
            Next &gt;
          </button>
        </div>
      </div>

      {/* ── Top Telemetry Bar ── */}
      <div className="card mb-lg" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="mono-label" style={{ marginBottom: 2 }}>DAILY TELEMETRY</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>Session Overview</div>
          </div>

          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#F59E0B' }}>{completionRate}%</div>
              <div className="mono-label" style={{ fontSize: '0.58rem' }}>TASKS</div>
            </div>

            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatMinutes(todayStudyMin)}</div>
              <div className="mono-label" style={{ fontSize: '0.58rem' }}>DEEP WORK</div>
            </div>

            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>{todayFocusCount}/5</div>
              <div className="mono-label" style={{ fontSize: '0.58rem' }}>FOCUS</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Grid ── */}
      <div className="page-grid">
        
        {/* LEFT COLUMN: Input Forms */}
        <div className="flex-col gap-lg">
          
          {/* Row 1: Planned & Completed */}
          <div className="grid-2">
            <div className="card">
              <div className="mono-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>⚑</span> What I planned
              </div>
              <textarea
                className="textarea"
                placeholder="List original objectives..."
                value={form.planned}
                onChange={e => setForm({ ...form, planned: e.target.value })}
                rows={3}
              />
            </div>

            <div className="card">
              <div className="mono-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>✓</span> What I completed
              </div>
              <textarea
                className="textarea"
                placeholder="List actual achievements..."
                value={form.completed}
                onChange={e => setForm({ ...form, completed: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Row 2: What I Learned */}
          <div className="card">
            <div className="mono-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🎓</span> What I learned (Key concepts)
            </div>
            <textarea
              className="textarea"
              placeholder="Technical insights gained today..."
              value={form.learned}
              onChange={e => setForm({ ...form, learned: e.target.value })}
              rows={4}
            />
          </div>

          {/* Row 3: Problems & Mistakes */}
          <div className="grid-2">
            <div className="card">
              <div className="mono-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>❓</span> Biggest problem / confusion
              </div>
              <textarea
                className="textarea"
                placeholder="Blockers or conceptual hurdles..."
                value={form.confusion}
                onChange={e => setForm({ ...form, confusion: e.target.value })}
                rows={3}
              />
            </div>

            <div className="card">
              <div className="mono-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🛠</span> Mistake I made &amp; How I fixed it
              </div>
              <textarea
                className="textarea"
                placeholder="Errors and resolutions..."
                value={form.mistake}
                onChange={e => setForm({ ...form, mistake: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          {/* Row 4: Tomorrow's Goal */}
          <div className="card">
            <div className="mono-label" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#F59E0B' }}>
              <span>🚀</span> Tomorrow&apos;s single most important task
            </div>
            <textarea
              className="textarea"
              placeholder="One clear directive for the next session..."
              value={form.tomorrowTask}
              onChange={e => setForm({ ...form, tomorrowTask: e.target.value })}
              rows={2}
            />
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.80rem', color: savedMsg ? 'var(--green)' : 'var(--text-muted)' }}>
              {savedMsg && '✓ Entry saved successfully!'}
            </div>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: Diary History */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ color: 'var(--text-muted)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Diary History
            </div>
          </div>

          <div className="flex-col gap-sm">
            {historyDates.length > 0 ? (
              historyDates.slice(0, 8).map(d => {
                const entry = diaryEntries[d] || {};
                const isSelected = d === selectedDate;
                return (
                  <div
                    key={d}
                    onClick={() => {
                      setSelectedDate(d);
                      setForm({
                        planned: entry.planned || '',
                        completed: entry.completed || '',
                        learned: entry.learned || '',
                        confusion: entry.confusion || '',
                        mistake: entry.mistake || '',
                        tomorrowTask: entry.tomorrowTask || '',
                        rating: entry.rating || 5,
                      });
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--r-md)',
                      border: isSelected ? '1px solid #F59E0B' : '1px solid var(--border)',
                      background: isSelected ? 'rgba(245, 158, 11, 0.06)' : 'var(--bg-input)',
                      cursor: 'pointer',
                      transition: 'all var(--t-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                      </div>
                      <span className="badge badge-accent" style={{ fontSize: '0.55rem' }}>
                        Focus: {entry.focusCount || 4}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }} className="truncate">
                      {entry.learned || entry.completed || entry.planned || 'Session reflections recorded.'}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                No past reflections saved yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
