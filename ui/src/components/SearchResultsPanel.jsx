import { useEffect, useRef } from 'react';
import './SearchResultsPanel.css';

export default function SearchResultsPanel({ searchResults, query, onSummarize }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [searchResults]);

  if (!searchResults || searchResults.length === 0) {
    return (
      <section className="search-results-panel">
        <div className="empty-state">
          <div className="empty-icon">?</div>
          <div className="empty-text">
            {query ? 'No matching logs found' : 'Enter a query to search logs'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="search-results-panel">
      <div className="results-header">
        <span className="results-count">{searchResults.length} results</span>
        <span className="results-query">"{query}"</span>
      </div>
      <div className="results-list">
        {searchResults.map((result, index) => (
          <SearchResultEntry
            key={result.id}
            result={result}
            rank={index + 1}
            onSummarize={onSummarize}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </section>
  );
}

function SearchResultEntry({ result, rank, onSummarize }) {
  const handleClick = async () => {
    if (onSummarize) {
      await onSummarize(result.text);
    }
  };
  return (
    <div className="search-result-entry" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="result-rank">#{rank}</div>
      <div className="result-content">
        <div className="result-header">
          <div className="result-score">
            <div className="score-label">Score</div>
            <div className="score-value">{(result.score * 100).toFixed(1)}%</div>
            <ScoreBar value={result.score} />
          </div>
        </div>
        <div className="result-text">
          {result.text}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ value }) {
  const color = value > 0.85 ? '#10b981' : value > 0.7 ? '#f59e0b' : '#ef4444';
  const height = Math.min(value * 3, 3) + 'px';
  return (
    <div className="score-bar">
      <div className="score-bar-fill" style={{ width: `${value * 100}%`, background: color, height }} />
    </div>
  );
}