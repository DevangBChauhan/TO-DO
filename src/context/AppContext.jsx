import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createDefaultRoadmap, DEFAULT_TARGET_DATE, DEFAULT_START_DATE } from '../data/defaultRoadmap';
import { generateId, today } from '../utils/progressUtils';

const AppContext = createContext(null);

const DEFAULT_SETTINGS = {
  name: 'SDET Aspirant',
  targetRole: 'SDET',
  targetDate: DEFAULT_TARGET_DATE,
  startDate: DEFAULT_START_DATE,
  weekdayHours: 1.5,
  weekendHours: 3,
  defaultTimer: 'pomodoro',
  theme: 'dark',
  studyReminderTime: '19:00',
  checkinReminderTime: '20:30',
};

export function AppProvider({ children }) {
  // ─── Persistent State ──────────────────────────────────────────────
  const [settings, setSettings] = useLocalStorage('qasc_settings', DEFAULT_SETTINGS);
  const [roadmap, setRoadmap] = useLocalStorage('qasc_roadmap', createDefaultRoadmap());
  const [dailyTasks, setDailyTasks] = useLocalStorage('qasc_tasks', []);
  const [diaryEntries, setDiaryEntries] = useLocalStorage('qasc_diary', []);
  const [focusSessions, setFocusSessions] = useLocalStorage('qasc_focus', []);
  const [weeklyReviews, setWeeklyReviews] = useLocalStorage('qasc_reviews', []);

  // ─── Settings ─────────────────────────────────────────────────────
  function updateSettings(updates) {
    setSettings(prev => ({ ...prev, ...updates }));
  }

  // ─── Roadmap CRUD ─────────────────────────────────────────────────
  function addPhase(phaseData) {
    const newPhase = {
      id: generateId(),
      name: '',
      description: '',
      phaseNumber: roadmap.length + 1,
      weeksRange: '',
      priority: 'important',
      status: 'not-started',
      badge: '',
      color: '#f0a500',
      weeks: [],
      milestone: '',
      ...phaseData,
    };
    setRoadmap(prev => [...prev, newPhase]);
    return newPhase;
  }

  function updatePhase(phaseId, updates) {
    setRoadmap(prev =>
      prev.map(p => (p.id === phaseId ? { ...p, ...updates } : p))
    );
  }

  function deletePhase(phaseId) {
    setRoadmap(prev => prev.filter(p => p.id !== phaseId));
  }

  function addWeek(phaseId, weekData) {
    const newWeek = {
      id: generateId(),
      name: '',
      tasks: [],
      ...weekData,
    };
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId ? { ...p, weeks: [...(p.weeks || []), newWeek] } : p
      )
    );
    return newWeek;
  }

  function updateWeek(phaseId, weekId, updates) {
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId
          ? {
              ...p,
              weeks: (p.weeks || []).map(w =>
                w.id === weekId ? { ...w, ...updates } : w
              ),
            }
          : p
      )
    );
  }

  function deleteWeek(phaseId, weekId) {
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId
          ? { ...p, weeks: (p.weeks || []).filter(w => w.id !== weekId) }
          : p
      )
    );
  }

  function addRoadmapTask(phaseId, weekId, taskData) {
    const newTask = {
      id: generateId(),
      name: '',
      priority: 'important',
      completed: false,
      completedAt: null,
      ...taskData,
    };
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId
          ? {
              ...p,
              weeks: (p.weeks || []).map(w =>
                w.id === weekId
                  ? { ...w, tasks: [...(w.tasks || []), newTask] }
                  : w
              ),
            }
          : p
      )
    );
    return newTask;
  }

  function updateRoadmapTask(phaseId, weekId, taskId, updates) {
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId
          ? {
              ...p,
              weeks: (p.weeks || []).map(w =>
                w.id === weekId
                  ? {
                      ...w,
                      tasks: (w.tasks || []).map(t =>
                        t.id === taskId ? { ...t, ...updates } : t
                      ),
                    }
                  : w
              ),
            }
          : p
      )
    );
  }

  function toggleRoadmapTask(phaseId, weekId, taskId) {
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId
          ? {
              ...p,
              weeks: (p.weeks || []).map(w =>
                w.id === weekId
                  ? {
                      ...w,
                      tasks: (w.tasks || []).map(t =>
                        t.id === taskId
                          ? {
                              ...t,
                              completed: !t.completed,
                              completedAt: !t.completed ? new Date().toISOString() : null,
                            }
                          : t
                      ),
                    }
                  : w
              ),
            }
          : p
      )
    );
  }

  function deleteRoadmapTask(phaseId, weekId, taskId) {
    setRoadmap(prev =>
      prev.map(p =>
        p.id === phaseId
          ? {
              ...p,
              weeks: (p.weeks || []).map(w =>
                w.id === weekId
                  ? { ...w, tasks: (w.tasks || []).filter(t => t.id !== taskId) }
                  : w
              ),
            }
          : p
      )
    );
  }

  // ─── Daily Tasks CRUD ─────────────────────────────────────────────
  function addDailyTask(taskData) {
    const newTask = {
      id: generateId(),
      title: '',
      description: '',
      date: today(),
      phaseId: null,
      weekId: null,
      category: 'Learning',
      priority: 'medium',
      estimatedMinutes: 30,
      status: 'todo',
      completedAt: null,
      actualMinutes: null,
      notes: '',
      ...taskData,
    };
    setDailyTasks(prev => [...prev, newTask]);
    return newTask;
  }

  function updateDailyTask(taskId, updates) {
    setDailyTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, ...updates } : t))
    );
  }

  function completeDailyTask(taskId) {
    setDailyTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed', completedAt: new Date().toISOString() }
          : t
      )
    );
  }

  function deleteDailyTask(taskId) {
    setDailyTasks(prev => prev.filter(t => t.id !== taskId));
  }

  // ─── Diary CRUD ───────────────────────────────────────────────────
  function upsertDiaryEntry(dateStr, data) {
    setDiaryEntries(prev => {
      const existing = prev.find(e => e.date === dateStr);
      if (existing) {
        return prev.map(e =>
          e.date === dateStr
            ? { ...e, ...data, updatedAt: new Date().toISOString() }
            : e
        );
      }
      return [
        ...prev,
        {
          id: `diary-${dateStr}`,
          date: dateStr,
          planned: '',
          completed: '',
          learned: '',
          confusion: '',
          mistake: '',
          howFixed: '',
          stillDontUnderstand: '',
          tomorrowTask: '',
          confidence: 3,
          updatedAt: new Date().toISOString(),
          ...data,
        },
      ];
    });
  }

  function getDiaryEntry(dateStr) {
    return diaryEntries.find(e => e.date === dateStr) || null;
  }

  // ─── Focus Sessions ───────────────────────────────────────────────
  function addFocusSession(sessionData) {
    const newSession = {
      id: generateId(),
      date: today(),
      taskId: null,
      taskTitle: 'Free Study',
      sessionType: 'pomodoro',
      plannedMinutes: 25,
      actualMinutes: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      outcome: null,
      ...sessionData,
    };
    setFocusSessions(prev => [...prev, newSession]);
    return newSession;
  }

  function updateFocusSession(sessionId, updates) {
    setFocusSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, ...updates } : s))
    );
  }

  // ─── Weekly Reviews ───────────────────────────────────────────────
  function upsertWeeklyReview(weekKey, data) {
    setWeeklyReviews(prev => {
      const existing = prev.find(r => r.weekKey === weekKey);
      if (existing) {
        return prev.map(r =>
          r.weekKey === weekKey ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
        );
      }
      return [
        ...prev,
        {
          id: generateId(),
          weekKey,
          wentWell: '',
          wentBadly: '',
          learned: '',
          avoided: '',
          technicalWeakness: '',
          repeat: '',
          stop: '',
          nextWeekObjective: '',
          tasksScore: 0,
          codingScore: 0,
          githubScore: 0,
          consistencyScore: 0,
          githubActivity: '',
          updatedAt: new Date().toISOString(),
          ...data,
        },
      ];
    });
  }

  // ─── Data Export / Import / Reset ─────────────────────────────────
  function exportData() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      roadmap,
      dailyTasks,
      diaryEntries,
      focusSessions,
      weeklyReviews,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qasc-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.version !== 1) throw new Error('Incompatible data version');
      if (data.settings) setSettings(data.settings);
      if (data.roadmap) setRoadmap(data.roadmap);
      if (data.dailyTasks) setDailyTasks(data.dailyTasks);
      if (data.diaryEntries) setDiaryEntries(data.diaryEntries);
      if (data.focusSessions) setFocusSessions(data.focusSessions);
      if (data.weeklyReviews) setWeeklyReviews(data.weeklyReviews);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  function resetAllData() {
    setSettings(DEFAULT_SETTINGS);
    setRoadmap(createDefaultRoadmap());
    setDailyTasks([]);
    setDiaryEntries([]);
    setFocusSessions([]);
    setWeeklyReviews([]);
  }

  // ─── Context Value ────────────────────────────────────────────────
  const value = {
    settings, updateSettings,
    roadmap, setRoadmap,
    addPhase, updatePhase, deletePhase,
    addWeek, updateWeek, deleteWeek,
    addRoadmapTask, updateRoadmapTask, toggleRoadmapTask, deleteRoadmapTask,
    dailyTasks, addDailyTask, updateDailyTask, completeDailyTask, deleteDailyTask,
    diaryEntries, upsertDiaryEntry, getDiaryEntry,
    focusSessions, addFocusSession, updateFocusSession,
    weeklyReviews, upsertWeeklyReview,
    exportData, importData, resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
