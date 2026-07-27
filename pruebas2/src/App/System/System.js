import './System.css';
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav';

const System = () => {
  const [checks, setChecks] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerEstado = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL;
        const respuesta = await fetch(`${baseUrl}/api/pingdom-status`);
        const datos = await respuesta.json();
        
        // Pingdom agrupa los resultados dentro de la propiedad "checks"
        if (datos && datos.checks) {
          setChecks(datos.checks);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerEstado();
  }, []);

  return (
    <>
      {/* La navegación queda intacta en su lugar */}
      <Nav />
      
      <div className="system-container">
        <div className="system-header">
          <h1 className="system-title">System <span>STATUS</span></h1>
          <p className="system-subtitle">Monitoreo en tiempo real de la conexión de la plataforma.</p>
        </div>

        {cargando ? (
          <div className="system-loading">Obteniendo métricas del servidor...</div>
        ) : (
          <div className="system-grid">
            {checks.length > 0 ? (
              checks.map((check) => (
                <div key={check.id} className="status-card">
                  <div className="status-info">
                    <h3>{check.name}</h3>
                    <span className="status-time">
                      Tiempo de respuesta: {check.lastresponsetime} ms
                    </span>
                  </div>
                  {/* Cambiamos el color de la etiqueta dinámicamente según el estado */}
                  <div className={`status-badge ${check.status === 'up' ? 'status-up' : 'status-down'}`}>
                    {check.status === 'up' ? 'ONLINE' : 'OFFLINE'}
                  </div>
                </div>
              ))
            ) : (
              <p className="system-error">No hay métricas registradas en este momento.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default System;