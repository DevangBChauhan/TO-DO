import { useApp } from '../../context/AppContext';

export default function DiaryHistory({ onSelectDate }) {
  const { diaryEntries, dailyTasks, focusSessions } = useApp();

  const sorted = [...diaryEntries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '2rem' }}>
        <div className="empty-icon">📓</div>
        <div className="empty-title">No diary entries yet</div>
        <div className="empty-desc">Fill today&apos;s entry and it will appear here.</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sorted.map(entry => {
        const tasks = dailyTasks.filter(t => t.date === entry.date);
        const done = tasks.filter(t => t.status === 'completed').length;
        const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
        const studyMin = focusSessions.filter(s => s.date === entry.date).reduce((s, f) => s + (f.actualMinutes || 0), 0);
        const confColors = ['', '#ef4444', '#f0a500', '#eab308', '#22c55e', '#22c55e'];

        return (
          <button
            key={entry.id}
            className="card card-hover"
            style={{ textAlign: 'left', cursor: 'pointer', padding: 'var(--sp-md)' }}
            onClick={() => onSelectDate(entry.date)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {entry.confidence && (
                  <span style={{ fontSize: '0.75rem', color: confColors[entry.confidence] || 'var(--text-muted)', fontWeight: 600 }}>
                    Conf: {entry.confidence}/5
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: rate >= 70 ? 'var(--green)' : 'var(--text-muted)' }}>
                  {rate}% done
                </span>
              </div>
            </div>
            {entry.tomorrowTask && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                🎯 Tomorrow: {entry.tomorrowTask}
              </div>
            )}
            {entry.confusion && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                🧩 {entry.confusion.slice(0, 80)}{entry.confusion.length > 80 ? '…' : ''}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>{done}/{tasks.length} tasks</span>
              {studyMin > 0 && <span>{Math.round(studyMin / 60)}h {studyMin % 60}m study</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
