import React from 'react';
import './ServerStatus.css'; // <-- Importamos su propio CSS

const ServerStatus = ({ checks }) => {
  return (
    <div className="system-grid">
      {checks.length > 0 ? (
        checks.map((check) => (
          <div key={check.id} className="status-card">
            <div className="status-info">
              <h3>{check.name}</h3>
            </div>
            <div className={`status-badge ${check.status === 'up' ? 'status-up' : 'status-down'}`}>
              {check.status === 'up' ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
        ))
      ) : (
        <p className="system-error">No hay métricas registradas en este momento.</p>
      )}
    </div>
  );
};

export default ServerStatus;