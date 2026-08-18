import { useState, useEffect } from 'react';
import './index.css';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Today from './pages/Today';
import Diary from './pages/Diary';
import Focus from './pages/Focus';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { useApp } from './context/AppContext';
import { calcNextAction } from './utils/progressUtils';

function AppInner() {
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('qasc_theme') || 'dark');
  const { roadmap, dailyTasks } = useApp();

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.className = `theme-${theme}`;
    localStorage.setItem('qasc_theme', theme);
  }, [theme]);

  function navigate(page) {
    setActivePage(page);
  }

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  const nextAction = calcNextAction(roadmap, dailyTasks);

  const pages = {
    dashboard: <Dashboard onNavigate={navigate} />,
    roadmap:   <Roadmap />,
    today:     <Today onNavigate={navigate} />,
    diary:     <Diary />,
    focus:     <Focus />,
    progress:  <Progress />,
    settings:  <Settings />,
  };

  return (
    <div className={`app-layout theme-${theme}`}>
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={navigate} />

      {/* Main Content Area */}
      <div className="app-body">
        {/* Top Header Bar */}
        <header className="app-header" data-testid="app-header">
          {/* Notifications */}
          <button className="header-icon-btn" aria-label="Notifications" title="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>

          {/* User Icon */}
          <button className="header-icon-btn" aria-label="Profile" title="Profile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            className="header-icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Next Action Button */}
          {nextAction && (
            <button
              className="header-cta-btn"
              onClick={() => navigate(nextAction.source === 'today' ? 'today' : 'roadmap')}
            >
              Next Action →
            </button>
          )}
        </header>

        {/* Page Content View */}
        <main className="app-main" id="main-content" data-testid={activePage}>
          {pages[activePage] || pages.dashboard}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
