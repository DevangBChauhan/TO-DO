/**
 * reportUtils.js — Report data aggregation for Generate Report feature
 *
 * IMPORTANT: All calculations reuse existing progressUtils functions.
 * This file DOES NOT duplicate any progress logic.
 * It only aggregates and structures data for the report layer.
 */

import {
  calcOverallProgress,
  calcCompletedRoadmapTasks,
  calcTotalRoadmapTasks,
  calcPhaseProgress,
  getAllWeekTasks,
  getCurrentPhase,
  calcRoadmapHealth,
  calcStreak,
  calcNextAction,
  formatMinutes,
  daysRemaining,
  weeksRemaining,
  daysSince,
  totalDays,
  currentWeekNumber,
  today,
  formatDate,
} from './progressUtils';

// ─── Report Types ─────────────────────────────────────────────────────────────

export const REPORT_TYPES = [
  { id: 'current',  label: 'Current Progress',  desc: 'Full progress from start date to today' },
  { id: 'weekly',   label: 'Weekly Report',      desc: 'This calendar week (Mon – today)' },
  { id: 'monthly',  label: 'Monthly Report',     desc: 'This calendar month (1st – today)' },
  { id: 'full',     label: 'Full Journey',        desc: 'Everything stored in the application' },
  { id: 'custom',   label: 'Custom Date Range',  desc: 'You choose the from/to dates' },
];

// ─── Date Range Computation ───────────────────────────────────────────────────

export function getReportDateRange(reportType, customFrom, customTo, settings) {
  const todayStr = today();

  switch (reportType) {
    case 'weekly': {
      const d = new Date();
      const day = d.getDay(); // 0=Sun
      const diff = day === 0 ? -6 : 1 - day;
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() + diff);
      const from = weekStart.toISOString().split('T')[0];
      return { from, to: todayStr };
    }
    case 'monthly': {
      const d = new Date();
      const from = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      return { from, to: todayStr };
    }
    case 'full': {
      return { from: settings.startDate || '2020-01-01', to: todayStr };
    }
    case 'custom': {
      return { from: customFrom || settings.startDate, to: customTo || todayStr };
    }
    case 'current':
    default: {
      return { from: settings.startDate || todayStr, to: todayStr };
    }
  }
}

function isInRange(dateStr, from, to) {
  if (!dateStr) return false;
  return dateStr >= from && dateStr <= to;
}

// ─── Main Report Builder ──────────────────────────────────────────────────────

export function buildReport({ roadmap, dailyTasks, focusSessions, diaryEntries, weeklyReviews, settings }, reportType, dateRange) {
  const { from, to } = dateRange;
  const todayStr = today();

  // ── Period-scoped data ──────────────────────────────────────────────────────
  const periodTasks    = dailyTasks.filter(t => isInRange(t.date, from, to));
  const periodSessions = focusSessions.filter(s => isInRange(s.date, from, to));
  const periodDiary    = diaryEntries.filter(e => isInRange(e.date, from, to)).sort((a, b) => a.date.localeCompare(b.date));

  // ── Overall roadmap (always full, not period-scoped) ────────────────────────
  const overallProgress   = calcOverallProgress(roadmap);
  const completedRoadmap  = calcCompletedRoadmapTasks(roadmap);
  const totalRoadmap      = calcTotalRoadmapTasks(roadmap);
  const currentPhase      = getCurrentPhase(roadmap);
  const health            = calcRoadmapHealth(roadmap, settings);
  const streak            = calcStreak(dailyTasks, focusSessions);
  const nextAction        = calcNextAction(roadmap, dailyTasks);
  const weekNum           = currentWeekNumber(settings.startDate);
  const daysLeft          = daysRemaining(settings.targetDate);
  const weeksLeft         = weeksRemaining(settings.targetDate);

  // ── Period task stats ───────────────────────────────────────────────────────
  const pCompleted   = periodTasks.filter(t => t.status === 'completed');
  const pInProgress  = periodTasks.filter(t => t.status === 'in-progress');
  const pSkipped     = periodTasks.filter(t => t.status === 'skipped');
  const pTodo        = periodTasks.filter(t => t.status === 'todo');
  const completionRate = periodTasks.length > 0
    ? Math.round((pCompleted.length / periodTasks.length) * 100) : 0;
  const plannedMinutes = periodTasks.reduce((s, t) => s + (t.estimatedMinutes || 0), 0);
  const actualStudyMin = periodSessions.reduce((s, f) => s + (f.actualMinutes || 0), 0);

  // ── Focus stats ─────────────────────────────────────────────────────────────
  const sessionMins     = periodSessions.map(s => s.actualMinutes || 0);
  const avgSessionMin   = sessionMins.length > 0
    ? Math.round(sessionMins.reduce((a, b) => a + b, 0) / sessionMins.length) : 0;
  const maxSessionMin   = sessionMins.length > 0 ? Math.max(...sessionMins) : 0;
  const methodCounts    = {};
  for (const s of periodSessions) {
    methodCounts[s.sessionType] = (methodCounts[s.sessionType] || 0) + 1;
  }
  const mostUsedMethod  = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const methodLabel     = { pomodoro: 'Classic Pomodoro', deepwork: 'Deep Work', longfocus: 'Long Focus', custom: 'Custom' };

  // Focus time by task category (via task link)
  const focusByCategory = {};
  for (const session of periodSessions) {
    if (session.taskId) {
      const task = dailyTasks.find(t => t.id === session.taskId);
      const cat  = task?.category || 'Other';
      focusByCategory[cat] = (focusByCategory[cat] || 0) + (session.actualMinutes || 0);
    } else {
      focusByCategory['Free Study'] = (focusByCategory['Free Study'] || 0) + (session.actualMinutes || 0);
    }
  }

  // ── Task breakdown ──────────────────────────────────────────────────────────
  const tasksByCategory = {};
  const tasksByPriority = { high: [], medium: [], low: [] };
  for (const t of periodTasks) {
    tasksByCategory[t.category] = tasksByCategory[t.category] || { completed: 0, total: 0 };
    tasksByCategory[t.category].total++;
    if (t.status === 'completed') tasksByCategory[t.category].completed++;
    if (tasksByPriority[t.priority]) tasksByPriority[t.priority].push(t);
    else tasksByPriority['low'].push(t);
  }

  // ── Daily activity (each day in range) ─────────────────────────────────────
  const dailyActivity = [];
  const startD = new Date(from + 'T00:00:00');
  const endD   = new Date(to + 'T00:00:00');
  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayTasks = dailyTasks.filter(t => t.date === dateStr);
    const dayDone  = dayTasks.filter(t => t.status === 'completed').length;
    const daySess  = focusSessions.filter(s => s.date === dateStr);
    const dayMin   = daySess.reduce((s, f) => s + (f.actualMinutes || 0), 0);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const planned   = isWeekend ? settings.weekendHours * 60 : settings.weekdayHours * 60;
    dailyActivity.push({
      date: dateStr,
      label: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      shortLabel: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      plannedMinutes: planned,
      actualMinutes: dayMin,
      tasksCompleted: dayDone,
      totalTasks: dayTasks.length,
      focusSessions: daySess.length,
      active: dayDone > 0 || daySess.length > 0,
    });
  }

  // ── Consistency ─────────────────────────────────────────────────────────────
  const activeDays   = dailyActivity.filter(d => d.active).length;
  const missedDays   = dailyActivity.filter(d => !d.active).length;
  const avgDailyMin  = dailyActivity.length > 0
    ? Math.round(actualStudyMin / Math.max(activeDays, 1)) : 0;

  // ── Diary aggregation ───────────────────────────────────────────────────────
  const diaryAgg = {
    planned:           periodDiary.map(e => e.planned).filter(Boolean),
    completed:         periodDiary.map(e => e.completed).filter(Boolean),
    learned:           periodDiary.map(e => e.learned).filter(Boolean),
    confusion:         periodDiary.map(e => e.confusion).filter(Boolean),
    mistakes:          periodDiary.map(e => e.mistake).filter(Boolean),
    howFixed:          periodDiary.map(e => e.howFixed).filter(Boolean),
    stillUnclear:      periodDiary.map(e => e.stillDontUnderstand).filter(Boolean),
    tomorrowTasks:     periodDiary.map(e => e.tomorrowTask).filter(Boolean),
    avgConfidence:     periodDiary.length > 0
      ? (periodDiary.reduce((s, e) => s + (e.confidence || 3), 0) / periodDiary.length).toFixed(1)
      : null,
  };

  // ── Weaknesses (data-driven) ────────────────────────────────────────────────
  const weaknesses = [];
  // High-priority tasks not completed in period
  const highIncomplete = periodTasks.filter(t => t.priority === 'high' && t.status !== 'completed');
  if (highIncomplete.length > 0) {
    weaknesses.push({
      area: 'High-Priority Tasks Incomplete',
      reason: `${highIncomplete.length} high-priority task(s) not yet completed.`,
      tasks: highIncomplete.slice(0, 3).map(t => t.title),
    });
  }
  // Categories with >50% skip rate
  for (const [cat, data] of Object.entries(tasksByCategory)) {
    const skipped = periodTasks.filter(t => t.category === cat && t.status === 'skipped').length;
    if (skipped > 1 && skipped / data.total > 0.4) {
      weaknesses.push({
        area: cat,
        reason: `${skipped} of ${data.total} tasks in this category were skipped.`,
        tasks: [],
      });
    }
  }
  // Repeated diary confusion topics
  const confusions = diaryAgg.confusion.join(' ').toLowerCase();
  const confKeywords = ['collections', 'oop', 'exception', 'xpath', 'selenium', 'pom', 'sql', 'api'];
  for (const kw of confKeywords) {
    const count = (confusions.match(new RegExp(kw, 'g')) || []).length;
    if (count >= 2) {
      weaknesses.push({
        area: kw.toUpperCase(),
        reason: `Mentioned as a confusion point in ${count} diary entries.`,
        tasks: [],
      });
    }
  }

  // ── Weekly reviews in range ─────────────────────────────────────────────────
  const relevantReviews = weeklyReviews.filter(r => r.weekKey && r.updatedAt && isInRange(r.updatedAt.split('T')[0], from, to));

  // ── Roadmap phase details ───────────────────────────────────────────────────
  const roadmapWithProgress = roadmap.map(phase => ({
    ...phase,
    progress:       calcPhaseProgress(phase),
    allTasks:       getAllWeekTasks(phase),
    completedCount: getAllWeekTasks(phase).filter(t => t.completed).length,
    totalCount:     getAllWeekTasks(phase).length,
    incompleteTasks: getAllWeekTasks(phase).filter(t => !t.completed),
  }));

  // ── Career target ───────────────────────────────────────────────────────────
  const elapsed     = daysSince(settings.startDate);
  const totalD      = totalDays(settings.startDate, settings.targetDate);
  const expectedPct = Math.round((elapsed / totalD) * 100);
  const gap         = overallProgress - expectedPct;

  // ── Current phase deep dive ─────────────────────────────────────────────────
  const currentPhaseDetail = currentPhase ? {
    ...currentPhase,
    progress:        calcPhaseProgress(currentPhase),
    completedCount:  getAllWeekTasks(currentPhase).filter(t => t.completed).length,
    totalCount:      getAllWeekTasks(currentPhase).length,
    remainingTasks:  getAllWeekTasks(currentPhase).filter(t => !t.completed),
  } : null;

  return {
    meta: {
      generatedAt:     new Date().toISOString(),
      reportType,
      reportTypeLabel: REPORT_TYPES.find(r => r.id === reportType)?.label || 'Report',
      dateRange,
      userName:        settings.name || 'Learner',
      targetRole:      settings.targetRole || 'SDET',
    },
    executive: {
      currentPhase,
      currentPhaseDetail,
      weekNum,
      totalWeeks:      20,
      overallProgress,
      completedRoadmap,
      totalRoadmap,
      totalStudyMin:   periodSessions.reduce((s, f) => s + (f.actualMinutes || 0), 0),
      totalStudyAllTime: focusSessions.reduce((s, f) => s + (f.actualMinutes || 0), 0),
      focusCount:      periodSessions.length,
      streak,
      health,
    },
    period: {
      tasks:          periodTasks,
      completed:      pCompleted,
      inProgress:     pInProgress,
      skipped:        pSkipped,
      todo:           pTodo,
      completionRate,
      plannedMinutes,
      actualStudyMin,
      focusSessions:  periodSessions,
    },
    roadmap:   roadmapWithProgress,
    currentPhaseDetail,
    tasks: {
      byCategory:    tasksByCategory,
      byPriority:    tasksByPriority,
      allCompleted:  pCompleted,
      allIncomplete: [...pInProgress, ...pTodo],
      allSkipped:    pSkipped,
    },
    focus: {
      totalMinutes:  actualStudyMin,
      sessionCount:  periodSessions.length,
      avgSessionMin,
      maxSessionMin,
      mostUsedMethod,
      mostUsedMethodLabel: methodLabel[mostUsedMethod] || mostUsedMethod,
      byCategory:    focusByCategory,
      sessions:      periodSessions,
    },
    diary: {
      entries:   periodDiary,
      aggregated: diaryAgg,
    },
    consistency: {
      streak,
      activeDays,
      totalDays:    dailyActivity.length,
      missedDays,
      avgDailyMin,
      weeklyAvgMin: Math.round(actualStudyMin / Math.max(Math.ceil(dailyActivity.length / 7), 1)),
      dailyActivity,
    },
    weeklyReviews: relevantReviews,
    health,
    careerTarget: {
      targetRole:      settings.targetRole,
      targetDate:      settings.targetDate,
      daysLeft,
      weeksLeft,
      expectedPct,
      actualPct:       overallProgress,
      gap,
    },
    nextAction,
    weaknesses,
  };
}

// ─── HTML Download Helper ─────────────────────────────────────────────────────

export function downloadReportAsHTML(reportHTML, userName, reportType) {
  const timestamp = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QA → SDET Progress Report — ${userName} — ${timestamp}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: #0d0d12; color: #f0f0f5; line-height: 1.6; padding: 24px; }
    ${getReportPrintStyles()}
  </style>
</head>
<body>
  ${reportHTML}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `qa-sdet-report-${reportType}-${today()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function getReportPrintStyles() {
  return `
    .report-wrap { max-width: 860px; margin: 0 auto; }
    .report-header { background: #1a1a26; border-radius: 12px; padding: 32px; margin-bottom: 24px; border: 1px solid #2a2a3a; }
    .report-title { font-size: 1.6rem; font-weight: 800; color: #f0f0f5; margin-bottom: 4px; }
    .report-subtitle { font-size: 0.9rem; color: #9898b0; }
    .report-meta { margin-top: 12px; font-size: 0.78rem; color: #5a5a72; }
    .report-section { background: #1a1a26; border: 1px solid #2a2a3a; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    .report-section-title { font-size: 1rem; font-weight: 700; color: #f0a500; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #2a2a3a; }
    .stat-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    .stat-box { background: #0f0f1a; border: 1px solid #2a2a3a; border-radius: 8px; padding: 12px; min-width: 120px; flex: 1; }
    .stat-box-num { font-size: 1.4rem; font-weight: 800; color: #f0a500; }
    .stat-box-label { font-size: 0.7rem; color: #5a5a72; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
    th { text-align: left; padding: 8px 12px; background: #0f0f1a; color: #9898b0; font-weight: 600; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 8px 12px; border-bottom: 1px solid #2a2a3a; color: #f0f0f5; }
    .progress-bar { background: #2a2a3a; border-radius: 4px; height: 6px; overflow: hidden; margin: 4px 0; }
    .progress-fill { height: 100%; background: #f0a500; border-radius: 4px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 0.68rem; font-weight: 600; }
    .badge-green { background: #22c55e22; color: #22c55e; }
    .badge-yellow { background: #f0a50022; color: #f0a500; }
    .badge-red { background: #ef444422; color: #ef4444; }
    .badge-blue { background: #3b82f622; color: #3b82f6; }
    .badge-muted { background: #2a2a3a; color: #9898b0; }
    .diary-entry { background: #0f0f1a; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-size: 0.82rem; border-left: 3px solid #f0a500; }
    .diary-date { font-size: 0.72rem; color: #9898b0; margin-bottom: 4px; }
    .task-row { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; border-bottom: 1px solid #2a2a3a; font-size: 0.82rem; }
    .task-check { color: #22c55e; font-weight: 700; flex-shrink: 0; }
    .task-name { flex: 1; color: #f0f0f5; }
    .task-meta { font-size: 0.7rem; color: #5a5a72; }
    .next-action-box { background: #f0a50011; border: 1px solid #f0a50044; border-radius: 10px; padding: 16px; }
    .section-divider { height: 1px; background: #2a2a3a; margin: 16px 0; }
    .text-muted { color: #5a5a72; }
    .text-accent { color: #f0a500; }
    .text-green { color: #22c55e; }
    .text-red { color: #ef4444; }
    .text-blue { color: #3b82f6; }
    .font-bold { font-weight: 700; }
    .mb-8 { margin-bottom: 8px; }
    .mb-12 { margin-bottom: 12px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 600px) { .stat-row { grid-template-columns: 1fr 1fr; } .grid-2 { grid-template-columns: 1fr; } }
  `;
}
