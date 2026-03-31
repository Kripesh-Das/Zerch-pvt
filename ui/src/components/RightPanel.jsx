import { INCIDENTS } from '../data/mockData';
import UploadSection from './UploadSection';
import './RightPanel.css';

export default function RightPanel({ onIncidentSelect, onUploadLogs }) {
    return (
        <aside className="right-panel">
            {/* Upload Section (Upper Right) */}
            <UploadSection onUpload={onUploadLogs} />

            {/* Incident Panel Section (Lower Right) */}
            <section className="incident-section incident-section--sidebar">
                <div className="section-header section-header--sticky">
                    <h2 className="card-title">Live Incidents</h2>
                    <span className="badge badge-error">{INCIDENTS.length} active</span>
                </div>
                <div className="incident-list">
                    {INCIDENTS.length === 0 ? (
                        <div className="incident-empty">
                            <div className="success-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="incident-empty__title">No incidents found</span>
                            <p className="incident-empty__subtitle">All systems running smoothly</p>
                        </div>
                    ) : (
                        INCIDENTS.map(inc => (
                            <div
                                key={inc.id}
                                className={`incident-card incident-card--${inc.severity}`}
                                onClick={() => onIncidentSelect(inc)}
                            >
                                <div className="incident-card__header">
                                    <span className="incident-dot" />
                                    <span className="incident-title">{inc.title}</span>
                                    <span className="incident-count">({inc.count} logs)</span>
                                </div>
                                <div className="incident-card__footer">
                                    <span className="incident-service">{inc.service}</span>
                                    <span className="incident-time">First seen {inc.firstSeen}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </aside>
    );
}
