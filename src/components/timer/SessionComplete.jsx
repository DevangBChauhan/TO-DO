export default function SessionComplete({ taskTitle, onMarkComplete, onContinue, onLeaveIncomplete }) {
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
        <div className="modal-title" style={{ textAlign: 'center', borderBottom: 'none', marginBottom: 8 }}>
          Session Complete!
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
          Working on: <strong>{taskTitle || 'Free Study'}</strong>
        </p>
        <div className="alert alert-info" style={{ marginBottom: 24, textAlign: 'left' }}>
          ⏱️ <strong>Activity ≠ Completion.</strong> Did you actually complete the task?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={onMarkComplete}
            data-testid="mark-complete">
            ✅ Yes, Mark Task Completed
          </button>
          <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={onContinue}>
            ▶ Continue Working on This
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'center' }} onClick={onLeaveIncomplete}>
            — Leave Incomplete
          </button>
        </div>
      </div>
    </div>
  );
}
