import React from 'react';
import './ServerStatus.css';

const ServerStatus = ({ checks }) => {
  return (
    <section style={{ padding: "0 8vw 60px 8vw" }}>
      <h2 className="reveal" style={{ fontSize: "24px", marginBottom: "30px", borderBottom: "1px solid rgba(86, 216, 255, 0.15)", paddingBottom: "15px" }}>
        Estado de Servidores
      </h2>
      
      <div className="features-grid">
        {checks.length > 0 ? (
          checks.map((check, idx) => (
            <div key={check.id} className="feature-card reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
              <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>{check.name}</h3>
              <div className={`server-badge ${check.status === 'up' ? 'up' : 'down'}`}>
                {check.status === 'up' ? '● ONLINE' : '● OFFLINE'}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#8fb8d8" }}>No hay métricas de servidores registradas en este momento.</p>
        )}
      </div>
    </section>
  );
};

export default ServerStatus;