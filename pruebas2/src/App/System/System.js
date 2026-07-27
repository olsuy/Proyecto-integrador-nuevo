import './System.css';
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav';

const System = () => {
  const [checks, setChecks] = useState([]);
  const [speedData, setSpeedData] = useState(null); // Estado para la velocidad
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  const obtenerDatos = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      const respuesta = await fetch(`${baseUrl}/api/pingdom-status`);
      const datos = await respuesta.json();
      
      if (datos && datos.checks) {
        setChecks(datos.checks);
      }

      // TODO: Aquí haremos la petición real al backend para el Page Speed después.
      // Por ahora, usamos los datos exactos de tu captura de Pingdom para armar el diseño.
      setSpeedData({
        grade: 'A',
        score: 100,
        loadTime: 89,
        pageSize: 1.18,
        requests: 2
      });

      // Actualizamos la hora para confirmar que el auto-refresco funciona
      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleTimeString());

    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    // 1. Ejecutar la primera vez inmediatamente al entrar a la pantalla
    obtenerDatos();

    // 2. Configurar el auto-refresco cada 1 minuto (60,000 milisegundos)
    const intervalo = setInterval(() => {
      console.log("Actualizando métricas en segundo plano...");
      obtenerDatos();
    }, 60000);

    // 3. Limpiar el temporizador si el usuario cambia de pestaña
    return () => clearInterval(intervalo);
  }, []);

  return (
    <>
      {/* La navegación permanece intacta y en su lugar original */}
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
            {/* SECCIÓN 1: ESTADO DEL SERVIDOR */}
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

            {/* SECCIÓN 2: VELOCIDAD DE PÁGINA (PAGE SPEED) */}
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
          </>
        )}
      </div>
    </>
  );
};

export default System;