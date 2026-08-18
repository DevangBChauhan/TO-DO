import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

const TIMER_PRESETS = [
  { id: 'pomodoro',  label: 'Classic Pomodoro (25m / 5m)' },
  { id: 'deepwork',  label: 'Deep Work (50m / 10m)' },
  { id: 'longfocus', label: 'Long Focus (90m / 15m)' },
  { id: 'custom',    label: 'Custom' },
];

const TARGET_ROLES = ['QA Engineer', 'Automation QA', 'SDET', 'Software Engineer in Test', 'Other'];

export default function Settings() {
  const { settings, updateSettings, exportData, importData, resetAllData } = useApp();
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({ ...settings });

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setSaved(false);
  }

  function handleSave() {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = importData(ev.target.result);
      if (result.success) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => setImportSuccess(false), 4000);
      } else {
        setImportError(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleReset() {
    if (resetConfirm) {
      resetAllData();
      setResetConfirm(false);
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 5000);
    }
  }

  return (
    <div className="page-content" data-testid="settings">
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-subtitle">Configure your study profile, roadmap timeline, and telemetry preferences.</p>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* ── 2-Column Form Layout ── */}
      <div className="page-2col-grid">
        
        {/* LEFT COLUMN: Profile, Timeline & Targets */}
        <div className="flex-col gap-lg">
          
          {/* Card 1: Profile & Targets */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 16 }}>
              PROFILE &amp; ROLE
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="SDET Student"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Role</label>
                <select
                  className="select"
                  value={form.targetRole}
                  onChange={e => set('targetRole', e.target.value)}
                >
                  {TARGET_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Roadmap Timeline */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 16 }}>
              ROADMAP TIMELINE
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="input"
                  value={form.startDate}
                  onChange={e => set('startDate', e.target.value)}
                />
                <div className="form-hint">Baseline start date</div>
              </div>

              <div className="form-group">
                <label className="form-label">Target / Deadline</label>
                <input
                  type="date"
                  className="input"
                  value={form.targetDate}
                  onChange={e => set('targetDate', e.target.value)}
                />
                <div className="form-hint">Job switch target deadline</div>
              </div>
            </div>
          </div>

          {/* Card 3: Study Hour Targets */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 16 }}>
              STUDY TARGETS
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Weekday Target (Hours/Day)</label>
                <input
                  type="number"
                  className="input"
                  min={0.5}
                  max={8}
                  step={0.5}
                  value={form.weekdayHours}
                  onChange={e => set('weekdayHours', Number(e.target.value))}
                />
                <div className="form-hint">Mon–Fri daily study objective</div>
              </div>

              <div className="form-group">
                <label className="form-label">Weekend Target (Hours/Day)</label>
                <input
                  type="number"
                  className="input"
                  min={0.5}
                  max={12}
                  step={0.5}
                  value={form.weekendHours}
                  onChange={e => set('weekendHours', Number(e.target.value))}
                />
                <div className="form-hint">Sat–Sun deep work objective</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Timer & Data Management */}
        <div className="flex-col gap-lg">
          
          {/* Card 1: Timer Preferences */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 16 }}>
              TIMER PREFERENCES
            </div>

            <div className="form-group mb-md">
              <label className="form-label">Default Focus Mode</label>
              <select
                className="select"
                value={form.defaultTimer}
                onChange={e => set('defaultTimer', e.target.value)}
              >
                {TIMER_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Card 2: Backup & Restore */}
          <div className="card">
            <div className="stat-card-title" style={{ marginBottom: 16 }}>
              DATA MANAGEMENT
            </div>

            <div className="flex-col gap-md">
              <button className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={exportData}>
                📥 Export JSON Backup
              </button>

              <input
                type="file"
                ref={fileRef}
                accept=".json"
                style={{ display: 'none' }}
                onChange={handleImport}
              />
              
              <button
                className="btn btn-outline btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => fileRef.current?.click()}
              >
                📤 Import JSON Backup
              </button>

              {importSuccess && (
                <div style={{ fontSize: '0.75rem', color: 'var(--green)', textAlign: 'center' }}>
                  ✓ Data restored successfully!
                </div>
              )}

              {importError && (
                <div style={{ fontSize: '0.75rem', color: 'var(--red)', textAlign: 'center' }}>
                  {importError}
                </div>
              )}

              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

              <button
                className="btn btn-sm"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: resetConfirm ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                  border: '1px solid var(--red)',
                  color: 'var(--red)'
                }}
                onClick={handleReset}
              >
                {resetConfirm ? '⚠️ Click again to confirm reset' : 'Reset All Progress'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
