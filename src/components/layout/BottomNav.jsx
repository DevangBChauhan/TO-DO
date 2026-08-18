const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',     icon: '🏠' },
  { id: 'roadmap',   label: 'Roadmap', icon: '🗺️' },
  { id: 'today',     label: 'Today',   icon: '📋' },
  { id: 'focus',     label: 'Focus',   icon: '⏱️' },
  { id: 'progress',  label: 'Progress',icon: '📊' },
  { id: 'settings',  label: 'Settings',icon: '⚙️' },
];

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      <div className="bottom-nav-items">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`bottom-nav-item${activePage === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
