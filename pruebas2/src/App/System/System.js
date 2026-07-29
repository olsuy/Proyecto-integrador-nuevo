import React, { useEffect, useRef, useState } from "react";
import Nav from "../Nav/Nav";
import "./System.css";

// =====================================================================
// IMPORTACIÓN DE TUS 5 MÓDULOS
// =====================================================================
import Indicators from "./Indicators/Indicators";
import ServerStatus from "./ServerStatus/ServerStatus";
import PageSpeed from "./PageSpeed/PageSpeed";
import Uptime from "./Uptime/Uptime";
import SystemLogs from "./SystemLogs/SystemLogs";

function System() {
  const containerRef = useRef(null);

  // --- ESTADOS DE PINGDOM ---
  const [checks, setChecks] = useState([]);
  const [speedData, setSpeedData] = useState(null);
  const [uptimeData, setUptimeData] = useState(null);
  const [statusOnline, setStatusOnline] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  const obtenerDatos = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "https://proyecto-integrador-nuevo-production.up.railway.app";
      
      // 1. Estado de Servidores
      const respuestaStatus = await fetch(`${baseUrl}/api/pingdom-status`);
      const datosStatus = await respuestaStatus.json();
      if (datosStatus && datosStatus.checks) {
        setChecks(datosStatus.checks);
        setStatusOnline(datosStatus.checks.every(c => c.status === 'up'));
      }

      // 2. Velocidad (Page Speed)
      const respuestaSpeed = await fetch(`${baseUrl}/api/pingdom-speed`);
      const datosSpeed = await respuestaSpeed.json();
      if (datosSpeed && datosSpeed.summary) {
        setSpeedData({
          grade: 'A', 
          score: datosSpeed.summary.performance?.grade || 100, 
          loadTime: datosSpeed.summary.loadtime || 96, 
          pageSize: datosSpeed.summary.bytes ? (datosSpeed.summary.bytes / 1024).toFixed(2) : 1.18, 
          requests: datosSpeed.summary.requests || 2
        });
      }

      // 3. Uptime y Logs
      const respuestaUptime = await fetch(`${baseUrl}/api/pingdom-uptime`);
      const datosUptime = await respuestaUptime.json();
      
      if (datosUptime && datosUptime.summary && datosUptime.outages) {
        const statusSummary = datosUptime.summary.summary?.status || {};
        const totalUp = statusSummary.totalup || 0;
        const totalDown = statusSummary.totaldown || 0;
        const totalTime = totalUp + totalDown;
        
        // Calculamos el % de disponibilidad real
        const uptimePercent = totalTime > 0 ? ((totalUp / totalTime) * 100) : 100;

        // Mapeamos los estados para la tabla de logs
        const rawStates = datosUptime.outages.summary?.states || [];
        const logs = rawStates.map((state, index) => {
          const fromDate = new Date(state.timefrom * 1000).toLocaleString();
          const toDate = new Date(state.timeto * 1000).toLocaleString();
          const durationMins = Math.round((state.timeto - state.timefrom) / 60);
          const durationText = durationMins < 60 ? `${durationMins} minutes` : `${Math.round(durationMins / 60)} hours`;

          return {
            id: index,
            status: state.status, // 'up', 'down', o 'unknown'
            from: fromDate,
            to: toDate,
            duration: durationText
          };
        }).reverse(); // Más reciente primero

        // Guardamos todo en el estado que alimenta a los módulos
        setUptimeData({
          downtime: `${Math.round(totalDown / 60)} minutes`,
          outages: logs.filter(log => log.status === 'down').length,
          uptimePercent: uptimePercent,
          logs: logs
        });
      }

      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleTimeString());
    } catch (error) {
      console.error("Error conectando con el backend:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
    // Refresco automático cada 60 segundos
    const intervalo = setInterval(() => obtenerDatos(), 60000);
    return () => clearInterval(intervalo);
  }, []);

  // --- ANIMACIONES DE APARICIÓN (GSAP/IntersectionObserver) ---
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal");
    if (!targets.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [checks, speedData, uptimeData]); 

  return (
    <>
      <Nav />
      <div className="system" ref={containerRef}>
        
        {/* ===================== HEADER OPERATIVO ===================== */}
        <section style={{ padding: "0 8vw", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <span className="system-eyebrow reveal is-revealed">
                <span className={`dot ${statusOnline ? "dot-online" : "dot-offline"}`}></span>
                Centro de Monitoreo
              </span>
              <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: "10px 0 0 0", color: "#fff", fontWeight: "800" }} className="reveal is-revealed">
                System Operations
              </h1>
            </div>
            {ultimaActualizacion && (
              <div className="reveal is-revealed" style={{ color: "#8fb8d8", fontSize: "14px", fontWeight: "600" }}>
                Última actualización: <span style={{ color: "#56d8ff" }}>{ultimaActualizacion}</span>
              </div>
            )}
          </div>
        </section>

        {/* ===================== MÓDULOS INYECTADOS ===================== */}
        
        {/* 1. KPIs Globales Superiores */}
        <Indicators speedData={speedData} uptimeData={uptimeData} />
        
        {/* 2. Tarjetas de Servidores (Online/Offline) */}
        <ServerStatus checks={checks} />
        
        {/* 3. Rendimiento (Velocidad de Carga) */}
        <PageSpeed speedData={speedData} />
        
        {/* 4. Tarjetas de Disponibilidad (Downtime %) */}
        <Uptime uptimeData={uptimeData} />
        
        {/* 5. Tabla de Historial (Logs de Caídas) */}
        <SystemLogs uptimeData={uptimeData} />

      </div>
    </>
  );
}

export default System;