import { useState } from 'react';
import { downloadReportAsHTML } from '../../utils/reportUtils';
import { formatDate, formatMinutes } from '../../utils/progressUtils';

export default function ReportPreview({ report, onClose }) {
  const [downloading, setDownloading] = useState(false);

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    setDownloading(true);
    // Simple wrapper logic to extract just the report container html for the download
    setTimeout(() => {
      const el = document.getElementById('report-printable-area');
      if (el) {
        downloadReportAsHTML(el.outerHTML, report.meta.userName, report.meta.reportType);
      }
      setDownloading(false);
    }, 100);
  }

  if (!report) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 2000 }}>
      <div className="modal no-print" style={{ maxWidth: 860, width: '100%', height: '90vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
        
        {/* Header toolbar (no-print) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Report Preview</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{report.meta.reportTypeLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={handlePrint}>🖨️ Print / PDF</button>
            <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Downloading...' : '⬇️ Download HTML'}
            </button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Scrollable Report Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--bg-base)' }}>
          <div id="report-printable-area" className="report-wrap report-print-area">
            
            {/* 1. Header */}
            <div className="report-header">
              <div className="report-title">SDET Progress Report</div>
              <div className="report-subtitle">Learning Command Center</div>
              <div className="report-meta">
                Generated: {formatDate(report.meta.generatedAt.split('T')[0])} <br/>
                Learner: {report.meta.userName} <br/>
                Period: {formatDate(report.meta.dateRange.from)} – {formatDate(report.meta.dateRange.to)} ({report.meta.reportTypeLabel})
              </div>
            </div>

            {/* 2. Executive Summary */}
            <div className="report-section">
              <div className="report-section-title">Executive Summary</div>
              <div className="stat-row">
                <div className="stat-box">
                  <div className="stat-box-num">{report.executive.overallProgress}%</div>
                  <div className="stat-box-label">Overall Progress</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-num" style={{ color: 'var(--green)' }}>{report.executive.completedRoadmap}</div>
                  <div className="stat-box-label">Tasks Completed</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-num" style={{ color: 'var(--blue)' }}>{formatMinutes(report.executive.totalStudyMin)}</div>
                  <div className="stat-box-label">Study Time (Period)</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box-num">{report.executive.focusCount}</div>
                  <div className="stat-box-label">Focus Sessions</div>
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', marginTop: 12 }}>
                Current Phase: <strong className="text-accent">{report.executive.currentPhase?.name || 'Complete'}</strong><br/>
                Health: <span className={`badge badge-${report.health.status.includes('track') ? 'green' : report.health.status.includes('risk') ? 'red' : 'yellow'}`} style={{ marginTop: 6 }}>
                  {report.health.emoji} {report.health.label}
                </span>
              </div>
            </div>

            {/* 3. Period Activity */}
            <div className="report-section">
              <div className="report-section-title">Activity for Selected Period</div>
              <div className="grid-2 mb-12">
                <div>
                  <div className="text-xs text-muted mb-8">TASK EXECUTION</div>
                  <div style={{ fontSize: '0.82rem' }}>
                    <span className="text-green font-bold">{report.period.completed.length}</span> Completed<br/>
                    <span className="text-accent font-bold">{report.period.inProgress.length}</span> In Progress<br/>
                    <span className="text-muted font-bold">{report.period.skipped.length}</span> Skipped<br/>
                    <div className="mt-xs text-xs">Completion Rate: <strong>{report.period.completionRate}%</strong></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-8">FOCUS & TIME</div>
                  <div style={{ fontSize: '0.82rem' }}>
                    Actual Time: <strong>{formatMinutes(report.period.actualStudyMin)}</strong><br/>
                    Avg Session: <strong>{formatMinutes(report.focus.avgSessionMin)}</strong><br/>
                    Most Used: <strong>{report.focus.mostUsedMethodLabel}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Completed Work List */}
            {report.period.completed.length > 0 && (
              <div className="report-section">
                <div className="report-section-title">Work Completed</div>
                {report.period.completed.map(t => (
                  <div key={t.id} className="task-row">
                    <div className="task-check">✓</div>
                    <div className="task-name">
                      {t.title}
                      <div className="task-meta">{formatDate(t.date)} · {t.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Missed/Incomplete Work */}
            {report.tasks.allIncomplete.length > 0 && (
              <div className="report-section">
                <div className="report-section-title text-red">Pending Work</div>
                {report.tasks.allIncomplete.map(t => (
                  <div key={t.id} className="task-row" style={{ opacity: 0.8 }}>
                    <div className="task-check" style={{ color: 'var(--red)' }}>○</div>
                    <div className="task-name">
                      {t.title}
                      <div className="task-meta text-red">{t.status.replace('-', ' ')} · {t.priority} priority</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. Learning Reflection (Diary) */}
            {report.diary.entries.length > 0 && (
              <div className="report-section">
                <div className="report-section-title">Learning Reflections</div>
                {report.diary.entries.slice(0, 5).map((e, i) => (
                  <div key={i} className="diary-entry">
                    <div className="diary-date">{formatDate(e.date)}</div>
                    {e.learned && <div><strong className="text-accent">Learned:</strong> {e.learned}</div>}
                    {e.confusion && <div className="mt-xs"><strong className="text-red">Confusions:</strong> {e.confusion}</div>}
                  </div>
                ))}
                {report.diary.entries.length > 5 && (
                  <div className="text-xs text-muted mt-sm">+ {report.diary.entries.length - 5} more entries in this period.</div>
                )}
              </div>
            )}

            {/* 7. Next Action */}
            {report.nextAction && (
              <div className="report-section" style={{ borderColor: 'var(--accent)', background: 'var(--accent-dim)' }}>
                <div className="report-section-title text-accent" style={{ borderColor: 'var(--accent-soft)' }}>Recommended Next Action</div>
                <div className="font-bold text-primary">{report.nextAction.title}</div>
                <div className="text-xs text-muted mt-xs">Source: {report.nextAction.source} · Priority: {report.nextAction.priority}</div>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 40, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              End of Report.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
