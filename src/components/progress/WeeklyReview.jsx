import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calcWeeklyScore, getScoreLabel } from '../../utils/progressUtils';

const QUESTIONS = [
  { key: 'wentWell',           label: '✅ What went well?',              rows: 2 },
  { key: 'wentBadly',          label: '❌ What went badly?',              rows: 2 },
  { key: 'learned',            label: '🧠 What did I actually learn?',    rows: 2 },
  { key: 'avoided',            label: '🚫 What did I avoid?',             rows: 1 },
  { key: 'technicalWeakness',  label: '⚠️ Biggest technical weakness?',   rows: 1 },
  { key: 'repeat',             label: '🔁 What should I repeat?',          rows: 1 },
  { key: 'stop',               label: '🛑 What should I stop?',            rows: 1 },
  { key: 'nextWeekObjective',  label: '🎯 Next week\'s main objective',     rows: 2 },
];

function getWeekKey() {
  const d = new Date();
  const year = d.getFullYear();
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export default function WeeklyReview() {
  const { weeklyReviews, upsertWeeklyReview } = useApp();
  const weekKey = getWeekKey();
  const existing = weeklyReviews.find(r => r.weekKey === weekKey);

  const [form, setForm] = useState({
    wentWell: '', wentBadly: '', learned: '', avoided: '', technicalWeakness: '',
    repeat: '', stop: '', nextWeekObjective: '',
    tasksScore: 0, codingScore: 0, githubScore: 0, consistencyScore: 0,
    githubActivity: '',
    ...existing,
  });
  const [saved, setSaved] = useState(false);

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); setSaved(false); }

  function handleSave() {
    upsertWeeklyReview(weekKey, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const total = Number(form.tasksScore) + Number(form.codingScore) + Number(form.githubScore) + Number(form.consistencyScore);
  const { label, color } = getScoreLabel(total);

  return (
    <div>
      {/* Score */}
      <div className="card mb-lg">
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
          Weekly Score — {weekKey}
        </div>
        <div className="grid-2" style={{ gap: 12, marginBottom: 16 }}>
          {[
            { key: 'tasksScore',       label: 'Tasks Completed',    max: 40 },
            { key: 'codingScore',      label: 'Practice / Coding',  max: 25 },
            { key: 'githubScore',      label: 'GitHub Activity',     max: 20 },
            { key: 'consistencyScore', label: 'Consistency',         max: 15 },
          ].map(item => (
            <div key={item.key} className="card card-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)' }}>{form[item.key]}/{item.max}</span>
              </div>
              <input type="range" min={0} max={item.max} value={form[item.key]}
                onChange={e => set(item.key, Number(e.target.value))} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color }}>
            {total}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div>
            <div style={{ fontWeight: 600, color, fontSize: '0.95rem' }}>{label}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {total >= 70 ? 'Great execution this week.' : total >= 50 ? 'Acceptable. Identify what broke.' : 'Fix the system, not just the score.'}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub */}
      <div className="form-group">
        <label className="form-label">🐙 GitHub Activity (manual)</label>
        <input className="input" placeholder="e.g. 5 commits, pushed POM framework" value={form.githubActivity}
          onChange={e => set('githubActivity', e.target.value)} />
      </div>

      {/* Reflection questions */}
      {QUESTIONS.map(q => (
        <div className="form-group" key={q.key}>
          <label className="form-label">{q.label}</label>
          <textarea className="textarea" rows={q.rows} value={form[q.key]}
            onChange={e => set(q.key, e.target.value)} />
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn btn-primary" onClick={handleSave}>💾 Save Review</button>
        {saved && <span style={{ fontSize: '0.82rem', color: 'var(--green)' }}>✓ Saved!</span>}
      </div>
    </div>
  );
}
