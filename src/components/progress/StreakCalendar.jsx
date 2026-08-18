import { today } from '../../utils/progressUtils';

export default function StreakCalendar({ dailyTasks, focusSessions, days = 28 }) {
  const activeDays = new Set();
  for (const t of dailyTasks) { if (t.status === 'completed' && t.date) activeDays.add(t.date); }
  for (const s of focusSessions) { if (s.date) activeDays.add(s.date); }

  const todayStr = today();
  const cells = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    cells.push({ dateStr, active: activeDays.has(dateStr), isToday: dateStr === todayStr });
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {cells.map(cell => (
          <div
            key={cell.dateStr}
            className={`streak-day${cell.active ? ' active' : ''}${cell.isToday ? ' today' : ''}`}
            title={`${cell.dateStr}${cell.active ? ' ✓' : ''}`}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div className="streak-day" />
          <span>No activity</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div className="streak-day active" />
          <span>Active day</span>
        </div>
      </div>
    </div>
  );
}
