import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { today } from '../../utils/progressUtils';

const CATEGORIES = ['Learning', 'Coding', 'Testing', 'Practice', 'Revision', 'Project', 'Interview', 'Documentation', 'Other'];

export default function TaskForm({ onClose, initialDate }) {
  const { addDailyTask, roadmap } = useApp();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: initialDate || today(),
    category: 'Learning',
    priority: 'medium',
    estimatedMinutes: 30,
    phaseId: '',
    notes: '',
  });

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    addDailyTask({ ...form, title: form.title.trim(), estimatedMinutes: Number(form.estimatedMinutes) });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-title" id="task-form-title">➕ Add Task</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Learn Java ArrayLists" autoFocus required maxLength={200} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="input" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="select" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Scheduled Time (optional)</label>
              <input type="time" className="input" value={form.timeSlot || ''}
                onChange={e => set('timeSlot', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Link to Phase (optional)</label>
            <select className="select" value={form.phaseId} onChange={e => set('phaseId', e.target.value)}>
              <option value="">— None —</option>
              {roadmap.map(p => <option key={p.id} value={p.id}>Phase {p.phaseNumber}: {p.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea className="textarea" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Any context or links..." />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" data-testid="add-task">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
