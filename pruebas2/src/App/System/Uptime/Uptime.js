import React from 'react';
import './Uptime.css'; // <-- Importamos su propio CSS

const UptimeSummary = ({ uptimeData }) => {
  if (!uptimeData) return null; 

  return (
    <div className="uptime-section">
      <h2 className="uptime-title">Uptime <span>Summary</span></h2>
      
      <div className="uptime-stats-grid">
        <div className="uptime-card">
          <span className="uptime-label">DOWNTIME</span>
          <div className="uptime-value">{uptimeData.downtime}</div>
          <span className="uptime-subtext">({uptimeData.outages} outages)</span>
        </div>
        <div className="uptime-card">
          <span className="uptime-label">UPTIME</span>
          <div className="uptime-value">{uptimeData.uptimePercent}</div>
        </div>
      </div>

      <div className="uptime-table-container">
        <table className="uptime-table">
          <thead>
            <tr>
              <th>STATUS</th>
              <th>FROM</th>
              <th>TO</th>
              <th>DURATION</th>
            </tr>
          </thead>
          <tbody>
            {uptimeData.logs.map((log) => (
              <tr key={log.id}>
                <td>
                  <div className={`log-badge log-${log.status}`}>
                    {log.status === 'up' ? '↑ UP' : log.status === 'down' ? '↓ DOWN' : '? UNKNOWN'}
                  </div>
                </td>
                <td>{log.from}</td>
                <td>{log.to}</td>
                <td>{log.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UptimeSummary;