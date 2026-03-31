import { useState, useRef } from 'react';
import './UploadSection.css';

export default function UploadSection({ onUpload }) {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    };

    const processFile = (file) => {
        // Simulate upload process
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n').filter(l => l.trim());
            const mockLogs = lines.map((line, i) => ({
                id: `up-${Date.now()}-${i}`,
                ts: new Date().toISOString().replace('T', ' ').slice(0, 19),
                level: line.includes('ERROR') ? 'ERROR' : line.includes('WARN') ? 'WARN' : 'INFO',
                service: 'UploadedLog',
                msg: line.trim(),
                similarity: parseFloat((0.6 + Math.random() * 0.35).toFixed(2))
            }));
            onUpload(mockLogs);
        };
        reader.readAsText(file);
    };

    return (
        <div className="upload-section card">
            <div className="card-header">
                <h2 className="card-title">Upload Logs</h2>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            </div>
            <div
                className={`upload-zone ${isDragging ? 'upload-zone--dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept=".log,.txt,.json"
                />
                <div className="upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" />
                    </svg>
                </div>
                <p className="upload-text">Drag & drop log files</p>
                <p className="upload-subtext">Supports .log, .txt, .json</p>
            </div>
        </div>
    );
}
