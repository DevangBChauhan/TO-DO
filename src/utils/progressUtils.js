// ─── ID Generation ───────────────────────────────────────────────────────────

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

export function today() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function daysRemaining(targetDateStr) {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

export function weeksRemaining(targetDateStr) {
  const days = daysRemaining(targetDateStr);
  if (days === null) return null;
  return Math.ceil(days / 7);
}

export function daysSince(startDateStr) {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
}

export function totalDays(startDateStr, targetDateStr) {
  if (!startDateStr || !targetDateStr) return 140; // default ~20 weeks
  const start = new Date(startDateStr + 'T00:00:00');
  const end = new Date(targetDateStr + 'T00:00:00');
  return Math.max(1, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
}

export function currentWeekNumber(startDateStr) {
  const elapsed = daysSince(startDateStr);
  return Math.min(20, Math.floor(elapsed / 7) + 1);
}

// ─── Roadmap Progress ─────────────────────────────────────────────────────────

export function getAllRoadmapTasks(roadmap) {
  const tasks = [];
  for (const phase of roadmap) {
    for (const week of phase.weeks || []) {
      for (const task of week.tasks || []) {
        tasks.push({ ...task, phaseId: phase.id, weekId: week.id });
      }
    }
  }
  return tasks;
}

export function calcPhaseProgress(phase) {
  const tasks = getAllWeekTasks(phase);
  if (tasks.length === 0) return 0;
  const done = tasks.filter(t => t.completed).length;
  return Math.round((done / tasks.length) * 100);
}

export function getAllWeekTasks(phase) {
  const tasks = [];
  for (const week of phase.weeks || []) {
    for (const task of week.tasks || []) {
      tasks.push(task);
    }
  }
  return tasks;
}

export function calcOverallProgress(roadmap) {
  const allTasks = getAllRoadmapTasks(roadmap);
  if (allTasks.length === 0) return 0;
  const done = allTasks.filter(t => t.completed).length;
  return Math.round((done / allTasks.length) * 100);
}

export function calcTotalRoadmapTasks(roadmap) {
  return getAllRoadmapTasks(roadmap).length;
}

export function calcCompletedRoadmapTasks(roadmap) {
  return getAllRoadmapTasks(roadmap).filter(t => t.completed).length;
}

// ─── Current Phase Detection ──────────────────────────────────────────────────

export function getCurrentPhase(roadmap) {
  // First "working" phase
  const working = roadmap.find(p => p.status === 'working');
  if (working) return working;
  // First "not-started" phase
  const notStarted = roadmap.find(p => p.status === 'not-started');
  if (notStarted) return notStarted;
  return roadmap[roadmap.length - 1] || null;
}

// ─── Roadmap Health ───────────────────────────────────────────────────────────

export function calcRoadmapHealth(roadmap, settings) {
  const { startDate, targetDate } = settings;
  const actual = calcOverallProgress(roadmap);
  const elapsed = daysSince(startDate);
  const total = totalDays(startDate, targetDate);
  const expected = Math.round((elapsed / total) * 100);
  const diff = actual - expected;

  if (diff >= -5) return { status: 'on-track', label: 'On Track', emoji: '🟢', diff, expected, actual };
  if (diff >= -15) return { status: 'slightly-behind', label: 'Slightly Behind', emoji: '🟡', diff, expected, actual };
  return { status: 'at-risk', label: 'At Risk', emoji: '🔴', diff, expected, actual };
}

// ─── Streak Calculation ───────────────────────────────────────────────────────

export function calcStreak(dailyTasks, focusSessions) {
  // A day "counts" if there is at least 1 completed task OR 1 focus session
  const activeDays = new Set();

  for (const task of dailyTasks) {
    if (task.status === 'completed' && task.date) activeDays.add(task.date);
  }
  for (const session of focusSessions) {
    if (session.date) activeDays.add(session.date);
  }

  let streak = 0;
  let best = 0;
  let cur = 0;
  const now = new Date();

  for (let i = 0; i <= 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (activeDays.has(dateStr)) {
      cur++;
      if (i === 0 || i === 1) streak = cur; // current streak counts back from today
    } else {
      if (i <= 1) streak = 0; // reset if today or yesterday missing
      cur = 0;
    }
    best = Math.max(best, cur);
  }

  return { current: streak, best };
}

// ─── Next Action ──────────────────────────────────────────────────────────────

export function calcNextAction(roadmap, dailyTasks) {
  const todayStr = today();

  // 1. High-priority incomplete task for today
  const todayHigh = dailyTasks.find(
    t => t.date === todayStr && t.status !== 'completed' && t.status !== 'skipped' && t.priority === 'high'
  );
  if (todayHigh) return { title: todayHigh.title, source: 'today', priority: 'high', task: todayHigh };

  // 2. Any incomplete task for today
  const todayAny = dailyTasks.find(
    t => t.date === todayStr && t.status !== 'completed' && t.status !== 'skipped'
  );
  if (todayAny) return { title: todayAny.title, source: 'today', priority: todayAny.priority, task: todayAny };

  // 3. First incomplete roadmap task in current phase
  const phase = getCurrentPhase(roadmap);
  if (phase) {
    for (const week of phase.weeks || []) {
      for (const task of week.tasks || []) {
        if (!task.completed) {
          return {
            title: task.name,
            source: 'roadmap',
            priority: task.priority,
            phase: phase.name,
            week: week.name,
          };
        }
      }
    }
  }

  return null;
}

// ─── Study Time ───────────────────────────────────────────────────────────────

export function calcTodayStudyMinutes(focusSessions) {
  const todayStr = today();
  return focusSessions
    .filter(s => s.date === todayStr)
    .reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
}

export function calcTotalStudyMinutes(focusSessions) {
  return focusSessions.reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
}

export function calcWeekStudyMinutes(focusSessions) {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return focusSessions
    .filter(s => s.date && new Date(s.date + 'T00:00:00') >= weekAgo)
    .reduce((sum, s) => sum + (s.actualMinutes || 0), 0);
}

export function formatMinutes(minutes) {
  if (!minutes || minutes === 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── Execution Ratio Calculation ──────────────────────────────────────────────

export function calcExecutionRatio(focusSessions, dailyTasks) {
  let codingMins = 0;
  let studyMins = 0;

  for (const s of focusSessions) {
    const mins = s.completedMinutes || s.actualMinutes || s.plannedMinutes || 0;
    const type = (s.sessionType || s.taskTitle || '').toLowerCase();
    if (type.includes('code') || type.includes('practice') || type.includes('leetcode') || type.includes('framework')) {
      codingMins += mins;
    } else {
      studyMins += mins;
    }
  }

  for (const t of dailyTasks) {
    if (t.status === 'completed') {
      const mins = t.estimatedMinutes || 30;
      if (t.category === 'coding' || t.category === 'practice') {
        codingMins += mins;
      } else {
        studyMins += mins;
      }
    }
  }

  const total = codingMins + studyMins;
  if (total === 0) {
    return { codingPct: 65, studyPct: 35, codingMins: 0, studyMins: 0, isLive: false };
  }

  const codingPct = Math.round((codingMins / total) * 100);
  const studyPct = 100 - codingPct;
  return { codingPct, studyPct, codingMins, studyMins, isLive: true };
}

// ─── Recovery & Pace Advice ───────────────────────────────────────────────────

export function calcRecoveryAdvice(roadmap, dailyTasks, focusSessions, settings) {
  const health = calcRoadmapHealth(roadmap, settings);
  const todayStr = today();
  const todayTasks = dailyTasks.filter(t => t.date === todayStr);
  const pendingCount = todayTasks.filter(t => t.status !== 'completed').length;

  if (health.status === 'at-risk') {
    return {
      status: 'Recovery: Priority High',
      badgeClass: 'badge-red',
      color: 'var(--red)',
      title: 'Pacing Behind Target',
      advice: `Currently ${Math.abs(health.diff)}% behind baseline. Prioritize completing 2 focus blocks today without skipping core coding tasks.`,
    };
  }

  if (health.status === 'slightly-behind') {
    return {
      status: 'Recovery: Active',
      badgeClass: 'badge-accent',
      color: 'var(--blue)',
      title: 'Recovery Status: Active',
      advice: "Don't double up on missed days. Resume normally at your planned daily 2h pace to maintain sustainable momentum.",
    };
  }

  return {
    status: 'Pace: Optimal',
    badgeClass: 'badge-green',
    color: 'var(--green)',
    title: 'On Track & Sustainable',
    advice: `Great consistency! You have ${pendingCount} task${pendingCount === 1 ? '' : 's'} remaining today. Pacing ahead of baseline.`,
  };
}

// ─── Weekly Score ─────────────────────────────────────────────────────────────

export function calcWeeklyScore(weeklyData) {
  const { tasksScore = 0, codingScore = 0, githubScore = 0, consistencyScore = 0 } = weeklyData;
  return tasksScore + codingScore + githubScore + consistencyScore;
}

export function getScoreLabel(score) {
  if (score >= 70) return { label: 'Good Week', color: '#22c55e' };
  if (score >= 50) return { label: 'Acceptable', color: '#f0a500' };
  return { label: 'Needs Attention', color: '#ef4444' };
}

