import React from 'react';
import './PageSpeed.css';

const PageSpeed = ({ speedData }) => {
  if (!speedData) return null; 

  return (
    <div className="speed-section">
      <h2 className="speed-title">Page Speed <span>Performance</span></h2>
      <div className="speed-grid">
        <div className="speed-card">
          <span className="speed-label">Performance grade</span>
          <div className="speed-value grade">
            <span className="grade-letter">{speedData.grade}</span> 
            <span className="grade-score">{speedData.score}/100</span>
          </div>
        </div>
        <div className="speed-card">
          <span className="speed-label">Load time</span>
          <div className="speed-value">
            {speedData.loadTime}<span className="speed-unit">MS</span>
          </div>
        </div>
        <div className="speed-card">
          <span className="speed-label">Page size</span>
          <div className="speed-value">
            {speedData.pageSize}<span className="speed-unit">KB</span>
          </div>
        </div>
        <div className="speed-card">
          <span className="speed-label">Requests</span>
          <div className="speed-value">
            {speedData.requests}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSpeed;