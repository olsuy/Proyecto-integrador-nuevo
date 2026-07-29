import React from 'react';
import './SystemLogs.css';

const SystemLogs = ({ uptimeData }) => {
  if (!uptimeData) return null;

  return (
    <section style={{ padding: "0 8vw 100px 8vw" }}>
      <h2 className="reveal" style={{ fontSize: "24px", marginBottom: "30px", borderBottom: "1px solid rgba(86, 216, 255, 0.15)", paddingBottom: "15px" }}>
        Registro de Conexión e Incidencias
      </h2>

      <div className="glass-table-wrap reveal">
        <table className="glass-table">
          <thead>
            <tr>
              <th>ESTADO</th>
              <th>DESDE</th>
              <th>HASTA</th>
              <th>DURACIÓN</th>
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

export default SystemLogs;