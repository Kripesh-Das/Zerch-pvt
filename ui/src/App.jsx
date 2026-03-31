import { useState } from 'react';
import { useLogs } from './hooks/useLogs';
import Topbar from './components/Topbar';
import LogPanel from './components/LogPanel';
import RightPanel from './components/RightPanel';
import SearchPanel from './components/SearchPanel';
import IncidentDetails from './components/IncidentDetails';
import './App.css';

function App() {
  const { logs, setLogs, paused, connected, togglePause, toggleConnect, simulateEvent } = useLogs();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [semanticView, setSemanticView] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  // New logs from upload section
  const handleUploadLogs = (newLogs) => {
    setIsThinking(true);
    // Mimic real-world delay for processing
    setTimeout(() => {
      setLogs && setLogs(prev => [...prev, ...newLogs]);
      setIsThinking(false);
    }, 1500);
  };

  const handleSimulate = () => {
    setIsThinking(true);
    simulateEvent();
    setTimeout(() => setIsThinking(false), 3000);
  };

  return (
    <div className="app-container">
      <Topbar thinking={isThinking} />

      <main className="app-main">
        <div className="layout-grid">
          {/* Main Column (Left) - Split into Upper (Search) and Lower (Logs) */}
          <div className="panel-main-column">
            <SearchPanel
              semanticView={semanticView}
              onToggleSemantic={() => setSemanticView(!semanticView)}
            />
            <LogPanel
              logs={logs}
              paused={paused}
              connected={connected}
              onTogglePause={togglePause}
              onToggleConnect={toggleConnect}
              onSimulate={handleSimulate}
              semanticView={semanticView}
            />
          </div>

          {/* Sidebar Column (Right) - Split into Upper (Upload) and Lower (Incidents) */}
          <div className="panel-side-column">
            <RightPanel
              onIncidentSelect={setSelectedIncident}
              onUploadLogs={handleUploadLogs}
            />
          </div>
        </div>
      </main>

      {/* Modal/Overlay */}
      <IncidentDetails
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
      />

      <footer className="status-bar">
        <div className="status-bar__left">
          <div className="status-item">
            <span className="status-label">Engine:</span>
            <span className="status-value status-value--ready">Running (Rust)</span>
          </div>
          <div className="status-item">
            <span className="status-label">Vectors:</span>
            <span className="status-value">{(logs.length * 1.5).toFixed(0)} and counting</span>
          </div>
        </div>
        <div className="status-bar__right">
          <span className="status-item">Connected to: localhost:8080</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
