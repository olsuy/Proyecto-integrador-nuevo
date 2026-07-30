import React from 'react';
import './Uptime.css'; 

const Uptime = ({ uptimeData }) => {
  if (!uptimeData) return null;

  return (
    <section style={{ padding: "0 8vw 100px 8vw" }}>
      <h2 className="reveal" style={{ fontSize: "24px", marginBottom: "30px", borderBottom: "1px solid rgba(86, 216, 255, 0.15)", paddingBottom: "15px" }}>
        Uptime Summary (7 Days)
      </h2>

      <div className="uptime-stats-grid">
        <div className="uptime-card reveal">
          <span className="uptime-value">{uptimeData.uptimePercent.toFixed(2)}%</span>
          <span className="uptime-label">Global Availability</span>
        </div>
        <div className="uptime-card reveal" style={{ transitionDelay: "0.1s" }}>
          <span className="uptime-value">{uptimeData.downtime}</span>
          <span className="uptime-label">Downtime</span>
          <span className="uptime-subtext">({uptimeData.outages} recorded outages)</span>
        </div>
      </div>

      <div className="glass-table-wrap reveal" style={{ transitionDelay: "0.2s" }}>
        <table className="glass-table">
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
                  <span className={`log-badge ${log.status}`}>
                    {log.status === 'up' ? '↑ UP' : log.status === 'down' ? '↓ DOWN' : '? UNKNOWN'}
                  </span>
                </td>
                <td>{log.from}</td>
                <td>{log.to}</td>
                <td>{log.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Uptime;