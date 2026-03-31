import './IncidentDetails.css';

export default function IncidentDetails({ incident, onClose }) {
    if (!incident) return null;

    return (
        <div className="incident-overlay" onClick={onClose}>
            <div className="incident-details" onClick={e => e.stopPropagation()}>
                <header className="incident-details__header">
                    <div className="header-info">
                        <span className={`severity-tag severity-tag--${incident.severity}`}>
                            {incident.severity.toUpperCase()}
                        </span>
                        <h1 className="header-title">{incident.title}</h1>
                        <span className="header-id">#{incident.id}</span>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </header>

                <div className="incident-details__content">
                    <div className="details-grid">
                        <Section title="Description" icon={<IconDoc />}>
                            <p className="text-body">{incident.description}</p>
                        </Section>

                        <Section title="AI Insight" icon={<IconAI />}>
                            <div className="insight-card">
                                <div className="insight-item">
                                    <span className="insight-lbl">Cause</span>
                                    <p className="insight-val">{incident.aiCause}</p>
                                </div>
                                <div className="insight-item">
                                    <span className="insight-lbl">Impact</span>
                                    <p className="insight-val">{incident.aiImpact}</p>
                                </div>
                            </div>
                        </Section>

                        <Section title="Similar Logs" icon={<IconLog />}>
                            <div className="similar-logs">
                                {incident.similarLogs.map((log, i) => (
                                    <div key={i} className="similar-log-item">
                                        <span className="log-line">{log}</span>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        <Section title="Suggested Fix" icon={<IconFix />}>
                            <ul className="fix-list">
                                {incident.fixes.map((fix, i) => (
                                    <li key={i} className="fix-item">
                                        <span className="fix-bullet" />
                                        {fix}
                                    </li>
                                ))}
                            </ul>
                        </Section>
                    </div>
                </div>

                <footer className="incident-details__footer">
                    <button className="btn btn-ghost" onClick={onClose}>Close</button>
                    <div className="footer-actions">
                        <button className="btn btn-ghost">Acknowledge</button>
                        <button className="btn btn-primary">Create Jira Issue</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="details-section">
            <div className="details-section__header">
                {icon}
                <h3 className="details-section__title">{title}</h3>
            </div>
            <div className="details-section__body">
                {children}
            </div>
        </div>
    );
}

function IconDoc() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>; }
function IconAI() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10h-10V2z" strokeOpacity="0.3" /></svg>; }
function IconLog() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M13 3v18" /><path d="M3 13h18" /></svg>; }
function IconFix() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>; }
