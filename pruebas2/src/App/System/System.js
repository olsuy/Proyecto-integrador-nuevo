import './System.css';
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav';

// Importamos los nuevos submódulos que acabas de crear
import ServerStatus from './ServerStatus';
import PageSpeed from './PageSpeed/PageSpeed';
import UptimeSummary from './Uptime/Uptime';

const System = () => {
  // Estados para guardar la información
  const [checks, setChecks] = useState([]);
  const [speedData, setSpeedData] = useState(null);
  const [uptimeData, setUptimeData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  const obtenerDatos = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      
      // 1. Petición de Estado (Online/Offline)
      const respuestaStatus = await fetch(`${baseUrl}/api/pingdom-status`);
      const datosStatus = await respuestaStatus.json();
      if (datosStatus && datosStatus.checks) setChecks(datosStatus.checks);

      // 2. Petición de Velocidad (Page Speed)
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

      // 3. Datos de Uptime (Simulados temporalmente)
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

      // Actualizamos la hora del monitoreo
      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleTimeString());
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    } finally {
      setCargando(false);
    }
  };

  // Se ejecuta al cargar la página y cada 60 segundos
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
            {/* Aquí mandamos a llamar a tus módulos pasándoles la información */}
            
            <PageSpeed speedData={speedData} />
            <ServerStatus checks={checks} />
            <UptimeSummary uptimeData={uptimeData} />
          </>
        )}
      </div>
    </>
  );
};

export default System;