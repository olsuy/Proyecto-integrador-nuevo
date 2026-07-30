import React from 'react';
import './ServerStatus.css';

const ServerStatus = ({ checks }) => {
  return (
    <div className="server-status-hud">
      {checks.length > 0 ? (
        checks.map((check, idx) => (
          <div key={check.id} className="hud-card reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
            <h3>{check.name}</h3>
            <div className={`server-badge ${check.status === 'up' ? 'up' : 'down'}`}>
              {check.status === 'up' ? '● ONLINE' : '● OFFLINE'}
            </div>
          </div>
        ))
      ) : null}
    </div>
  );
};

export default ServerStatus;