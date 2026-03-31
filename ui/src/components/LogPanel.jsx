import { useEffect, useRef, useState } from 'react';
import './LogPanel.css';

const LEVEL_CLASS = { INFO: 'log-info', WARN: 'log-warn', ERROR: 'log-error', DEBUG: 'log-debug' };

export default function LogPanel({ logs, paused, connected, onTogglePause, onToggleConnect, onSimulate, semanticView }) {
    const bottomRef = useRef(null);
    const [highlighted, setHighlighted] = useState(null);
    const [prevCount, setPrevCount] = useState(logs.length);

    useEffect(() => {
        if (!paused && logs.length > prevCount) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        setPrevCount(logs.length);
    }, [logs.length, paused]);

    const errorCount = logs.filter(l => l.level === 'ERROR').length;
    const warnCount = logs.filter(l => l.level === 'WARN').length;

    return (
        <section className="log-panel log-panel--main">
            <div className="log-panel__header">
                <div className="log-panel__title-row">
                    <div className="log-panel__title">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" />
                        </svg>
                        Uploaded Logs Stream
                    </div>
                    <div className="log-panel__counters">
                        <span className="counter counter--error">
                            <span className="counter-dot" />
                            {errorCount} errors
                        </span>
                        <span className="counter counter--warn">
                            <span className="counter-dot" />
                            {warnCount} warnings
                        </span>
                    </div>
                </div>

                <div className="log-panel__actions">
                    <div className={`status-badge ${connected ? 'status-badge--connected' : 'status-badge--disconnected'}`}>
                        <span className="status-dot" />
                        {connected ? 'Active' : 'Offline'}
                    </div>

                    <button
                        className={`btn btn-sm ${paused ? 'btn-success' : 'btn-ghost'}`}
                        onClick={onTogglePause}
                    >
                        {paused ? 'Resume logs' : 'Pause logs'}
                    </button>
                </div>
            </div>

            <div className="log-panel__stream" id="log-stream">
                {logs.length === 0 ? (
                    <div className="log-empty">
                        <span className="log-cursor" />
                        <span className="log-empty__text">Upload log files to start analysis...</span>
                    </div>
                ) : (
                    logs.map((log) => (
                        <LogEntry
                            key={log.id}
                            log={log}
                            highlighted={highlighted === log.id}
                            semanticView={semanticView}
                            onClick={() => setHighlighted(h => h === log.id ? null : log.id)}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {paused && (
                <div className="log-panel__paused-bar">
                    Log stream paused — {logs.length} entries buffered
                </div>
            )}
        </section>
    );
}

function LogEntry({ log, highlighted, semanticView, onClick }) {
    const cls = LEVEL_CLASS[log.level] || 'log-info';
    return (
        <div
            className={`log-entry ${cls} ${highlighted ? 'log-entry--highlighted' : ''} ${log.isNew ? 'log-entry--new' : ''}`}
            onClick={onClick}
        >
            <span className="log-ts">{log.ts}</span>
            <span className={`log-level-tag log-level-tag--${log.level?.toLowerCase()}`}>
                {log.level ?? 'INFO'}
            </span>
            <span className={`log-service log-service--${log.service?.toLowerCase().replace(/\s/g, '') ?? 'default'}`}>
                [{log.service}]
            </span>
            <span className="log-msg">{log.msg}</span>
            {semanticView && log.similarity != null && (
                <span className="log-sim" title="Cosine similarity score">
                    <SimBar value={log.similarity} />
                    {(log.similarity * 100).toFixed(0)}%
                </span>
            )}
        </div>
    );
}

function SimBar({ value }) {
    const color = value > 0.85 ? '#10b981' : value > 0.7 ? '#f59e0b' : '#ef4444';
    return (
        <span className="sim-bar">
            <span className="sim-bar__fill" style={{ width: `${value * 100}%`, background: color }} />
        </span>
    );
}
