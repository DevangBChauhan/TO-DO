import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calcTodayStudyMinutes, formatMinutes } from '../../utils/progressUtils';

const CONFIDENCE_LABELS = ['', 'Struggling 😔', 'Confused 😕', 'Okay 😐', 'Good 😊', 'Excellent! 🔥'];

export default function DiaryEntry({ date, onSaved }) {
  const { getDiaryEntry, upsertDiaryEntry, dailyTasks, focusSessions } = useApp();

  const savedEntry = getDiaryEntry(date);
  const [form, setForm] = useState({
    planned: '',
    completed: '',
    learned: '',
    confusion: '',
    mistake: '',
    howFixed: '',
    stillDontUnderstand: '',
    tomorrowTask: '',
    confidence: 3,
    ...savedEntry,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const entry = getDiaryEntry(date);
    if (entry) setForm(f => ({ ...f, ...entry }));
  }, [date]);

  const todayTasks = dailyTasks.filter(t => t.date === date);
  const completedTasks = todayTasks.filter(t => t.status === 'completed').length;
  const studyMin = calcTodayStudyMinutes(focusSessions.filter(s => s.date === date));
  const focusSessCount = focusSessions.filter(s => s.date === date).length;

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setSaved(false);
  }

  function handleSave() {
    upsertDiaryEntry(date, form);
    setSaved(true);
    if (onSaved) onSaved();
    setTimeout(() => setSaved(false), 3000);
  }

  const fields = [
    { key: 'planned',              label: '✅ What I planned',                      rows: 2, placeholder: 'What was today\'s goal?' },
    { key: 'completed',            label: '⚡ What I completed',                    rows: 2, placeholder: 'Exact output — what did you build/learn/solve?' },
    { key: 'learned',              label: '🧠 What I learned',                      rows: 2, placeholder: 'New concept, new understanding, new skill...' },
    { key: 'confusion',            label: '🧩 Biggest problem / confusion today',   rows: 2, placeholder: 'What concept or error blocked you?' },
    { key: 'mistake',              label: '❌ Mistake I made',                       rows: 1, placeholder: 'What did I get wrong?' },
    { key: 'howFixed',             label: '🔧 How I fixed it',                      rows: 1, placeholder: 'What helped solve it?' },
    { key: 'stillDontUnderstand', label: '🔁 What I still don\'t understand',      rows: 1, placeholder: 'What needs revision?' },
    { key: 'tomorrowTask',         label: '🎯 Tomorrow\'s single most important task', rows: 1, placeholder: 'One thing. Not five.' },
  ];

  return (
    <div>
      {/* Connected stats */}
      <div className="card mb-lg" style={{ background: 'var(--bg-surface)' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Today at a Glance
        </div>
        <div className="grid-3" style={{ gap: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)' }}>
              {completedTasks}/{todayTasks.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tasks Done</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--blue)' }}>
              {formatMinutes(studyMin)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Study Time</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)' }}>
              {focusSessCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Focus Sessions</div>
          </div>
        </div>
      </div>

      {/* Reflection fields */}
      {fields.map(f => (
        <div className="form-group" key={f.key}>
          <label className="form-label">{f.label}</label>
          <textarea
            className="textarea"
            rows={f.rows}
            value={form[f.key]}
            onChange={e => set(f.key, e.target.value)}
            placeholder={f.placeholder}
          />
        </div>
      ))}

      {/* Confidence slider */}
      <div className="form-group">
        <label className="form-label">
          📈 Confidence Level Today — {CONFIDENCE_LABELS[form.confidence]}
        </label>
        <input
          type="range" min={1} max={5} value={form.confidence}
          onChange={e => set('confidence', Number(e.target.value))}
          style={{ marginTop: 8 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
          <span>1 – Struggling</span><span>3 – Okay</span><span>5 – Excellent</span>
        </div>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
        <button className="btn btn-primary" onClick={handleSave}>
          💾 Save Entry
        </button>
        {saved && (
          <span style={{ fontSize: '0.82rem', color: 'var(--green)' }}>
            ✓ Saved!
          </span>
        )}
      </div>
    </div>
  );
}
