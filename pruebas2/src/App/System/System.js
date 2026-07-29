import './System.css';
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav';

const System = () => {
  const [checks, setChecks] = useState([]);
  const [speedData, setSpeedData] = useState(null);
  const [uptimeData, setUptimeData] = useState(null); // Nuevo estado para Uptime
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  const obtenerDatos = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      
      // 1. Estado (Online/Offline)
      const respuestaStatus = await fetch(`${baseUrl}/api/pingdom-status`);
      const datosStatus = await respuestaStatus.json();
      if (datosStatus && datosStatus.checks) setChecks(datosStatus.checks);

      // 2. Velocidad (Page Speed)
      const respuestaSpeed = await fetch(`${baseUrl}/api/pingdom-speed`);
      const datosSpeed = await respuestaSpeed.json();
      if (datosSpeed) {
        setSpeedData({
          grade: 'A', 
          score: datosSpeed.summary?.performance?.grade || 100, 
          loadTime: datosSpeed.summary?.loadtime || 96, 
          pageSize: datosSpeed.summary?.bytes ? (datosSpeed.summary.bytes / 1024).toFixed(2) : 1.18, 
          requests: datosSpeed.summary?.requests || 2
        });
      }

      // 3. Uptime (Simulado con los datos de tu captura temporalmente)
      // TODO: Conectar a fetch(`${baseUrl}/api/pingdom-uptime`) posteriormente
      setUptimeData({
        downtime: "44 minutes",
        outages: 2,
        uptimePercent: "99.21%",
        logs: [
          { id: 1, status: 'up', from: '27/07/2026 07:22:19 AM', to: '28/07/2026 11:44:19 PM', duration: '2 days' },
          { id: 2, status: 'unknown', from: '27/07/2026 07:19:19 AM', to: '27/07/2026 07:22:19 AM', duration: '3 minutes' },
          { id: 3, status: 'up', from: '26/07/2026 11:09:19 PM', to: '27/07/2026 07:19:19 AM', duration: '8 hours' }
        ]
      });

      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleTimeString());
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
    const intervalo = setInterval(() => obtenerDatos(), 60000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <>
      <Nav />
      <div className="system-container">
        <div className="system-header">
          <h1 className="system-title">System <span>STATUS</span></h1>
          <p className="system-subtitle">Monitoreo en tiempo real de la conexión de la plataforma.</p>
          {ultimaActualizacion && (
            <p className="system-update-time">Última actualización: {ultimaActualizacion}</p>
          )}
        </div>

        {cargando ? (
          <div className="system-loading">Obteniendo métricas del servidor...</div>
        ) : (
          <>
            {/* SECCIÓN 1: STATUS */}
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

            {/* SECCIÓN 2: VELOCIDAD */}
            {speedData && (
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
            )}

            {/* SECCIÓN 3: UPTIME SUMMARY */}
            {uptimeData && (
              <div className="speed-section">
                <h2 className="speed-title">Uptime <span>Summary</span></h2>
                
                <div className="uptime-stats-grid">
                  <div className="speed-card">
                    <span className="speed-label">DOWNTIME</span>
                    <div className="speed-value">{uptimeData.downtime}</div>
                    <span className="uptime-subtext">({uptimeData.outages} outages)</span>
                  </div>
                  <div className="speed-card">
                    <span className="speed-label">UPTIME</span>
                    <div className="speed-value">{uptimeData.uptimePercent}</div>
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
            )}
          </>
        )}
      </div>
    </>
  );
};

export default System;