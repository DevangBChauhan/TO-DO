import { useState } from 'react';
import { REPORT_TYPES, getReportDateRange } from '../../utils/reportUtils';
import { today, formatDate } from '../../utils/progressUtils';
import { useApp } from '../../context/AppContext';

export default function ReportConfig({ onGenerate, onClose }) {
  const { settings } = useApp();
  const [reportType, setReportType] = useState('current');
  const [customFrom, setCustomFrom] = useState(settings.startDate || today());
  const [customTo, setCustomTo]     = useState(today());

  const preview = getReportDateRange(reportType, customFrom, customTo, settings);

  function handleGenerate() {
    onGenerate({ reportType, dateRange: preview });
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="report-config-title"
        style={{ maxWidth: 520 }} data-testid="report-config">

        <div className="modal-title" id="report-config-title">
          📄 Generate Report
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 20 }}>
          Produces a professional progress report using your actual learning data.
          No data is sent anywhere — everything stays local.
        </p>

        {/* Report Type */}
        <div className="form-group" data-testid="report-type">
          <label className="form-label">Report Type</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {REPORT_TYPES.map(rt => (
              <button
                key={rt.id}
                onClick={() => setReportType(rt.id)}
                className="btn btn-ghost"
                style={{
                  justifyContent: 'flex-start',
                  padding: '10px 14px',
                  border: `1px solid ${reportType === rt.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: reportType === rt.id ? 'var(--accent-dim)' : 'transparent',
                  borderRadius: 'var(--r-md)',
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: reportType === rt.id ? 'var(--accent)' : 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {rt.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {rt.desc}
                  </div>
                </div>
                {reportType === rt.id && (
                  <span style={{ color: 'var(--accent)', fontSize: '1rem' }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date range */}
        {reportType === 'custom' && (
          <div className="form-row" data-testid="report-date-range">
            <div className="form-group">
              <label className="form-label">From</label>
              <input type="date" className="input" value={customFrom}
                onChange={e => setCustomFrom(e.target.value)} max={today()} />
            </div>
            <div className="form-group">
              <label className="form-label">To</label>
              <input type="date" className="input" value={customTo}
                onChange={e => setCustomTo(e.target.value)} max={today()} min={customFrom} />
            </div>
          </div>
        )}

        {/* Period preview */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '10px 14px', marginBottom: 20, fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Report period: </span>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
            {formatDate(preview.from)} → {formatDate(preview.to)}
          </span>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleGenerate} data-testid="generate-report">
            📊 Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
