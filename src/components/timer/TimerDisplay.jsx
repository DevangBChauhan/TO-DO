export default function TimerDisplay({ seconds, totalSeconds, isRunning, sessionType }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = totalSeconds > 0 ? 1 - seconds / totalSeconds : 0;

  const size = 220;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  const colors = {
    pomodoro: '#f0a500',
    deepwork: '#3b82f6',
    longfocus: '#8b5cf6',
    custom: '#22c55e',
    break: '#22c55e',
  };
  const color = colors[sessionType] || '#f0a500';

  return (
    <div className="timer-wrap" style={{ position: 'relative' }}>
      {/* Ring SVG */}
      <svg
        width={size}
        height={size}
        className="ring-svg"
        aria-hidden="true"
      >
        <circle
          className="ring-bg"
          strokeWidth={stroke}
          r={r}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="ring-fill"
          strokeWidth={stroke}
          r={r}
          cx={size / 2}
          cy={size / 2}
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>

      {/* Time text centered in ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
        data-testid="timer"
      >
        <div
          className="timer-display"
          style={{
            fontSize: '2.8rem',
            color: isRunning ? color : 'var(--text-primary)',
            transition: 'color 0.3s',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isRunning ? 'Focusing' : seconds === totalSeconds ? 'Ready' : 'Paused'}
        </div>
      </div>
    </div>
  );
}
