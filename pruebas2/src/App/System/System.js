import React, { useEffect, useRef, useState } from "react";
import Nav from "../Nav/Nav";
import "./System.css";
import Footer from "../Footer/Footer";
// Assets
import stationHero from "./assets/station-hero.png";
import stationGiant from "./assets/station-giant.png";

// Modules
import HeroSectionSystem from "./HeroSection/HeroSection";
import Indicators from "./Indicators/Indicators";
import ServerStatus from "./ServerStatus/ServerStatus";
import PageSpeed from "./PageSpeed/PageSpeed";
import Uptime from "./Uptime/Uptime";
import SystemLogs from "./SystemLogs/SystemLogs";

function System() {
  const containerRef = useRef(null);

  // States
  const [checks, setChecks] = useState([]);
  const [speedData, setSpeedData] = useState(null);
  const [uptimeData, setUptimeData] = useState(null);
  const [statusOnline, setStatusOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "https://proyecto-integrador-nuevo-production.up.railway.app";
      
      const statusResponse = await fetch(`${baseUrl}/api/pingdom-status`);
      const statusData = await statusResponse.json();
      if (statusData && statusData.checks) {
        setChecks(statusData.checks);
        setStatusOnline(statusData.checks.every(c => c.status === 'up'));
      }

      const speedResponse = await fetch(`${baseUrl}/api/pingdom-speed`);
      const speedDataObj = await speedResponse.json();
      if (speedDataObj && speedDataObj.summary) {
        setSpeedData({
          grade: 'A', 
          score: speedDataObj.summary.performance?.grade || 100, 
          loadTime: speedDataObj.summary.loadtime || 96, 
          pageSize: speedDataObj.summary.bytes ? (speedDataObj.summary.bytes / 1024).toFixed(2) : 1.18, 
          requests: speedDataObj.summary.requests || 2
        });
      }

      const uptimeResponse = await fetch(`${baseUrl}/api/pingdom-uptime`);
      const uptimeDataObj = await uptimeResponse.json();
      
      if (uptimeDataObj && uptimeDataObj.summary && uptimeDataObj.outages) {
        const statusSummary = uptimeDataObj.summary.summary?.status || {};
        const totalUp = statusSummary.totalup || 0;
        const totalDown = statusSummary.totaldown || 0;
        const totalTime = totalUp + totalDown;
        const uptimePercent = totalTime > 0 ? ((totalUp / totalTime) * 100) : 100;

        const rawStates = uptimeDataObj.outages.summary?.states || [];
        const logs = rawStates.map((state, index) => {
          const fromDate = new Date(state.timefrom * 1000).toLocaleString('en-US');
          const toDate = new Date(state.timeto * 1000).toLocaleString('en-US');
          const durationMins = Math.round((state.timeto - state.timefrom) / 60);
          const durationText = durationMins < 60 ? `${durationMins} minutes` : `${Math.round(durationMins / 60)} hours`;

          return { id: index, status: state.status, from: fromDate, to: toDate, duration: durationText };
        }).reverse();

        setUptimeData({
          downtime: `${Math.round(totalDown / 60)} minutes`,
          outages: logs.filter(log => log.status === 'down').length,
          uptimePercent: uptimePercent,
          logs: logs
        });
      }

      const now = new Date();
      setLastUpdate(now.toLocaleTimeString('en-US'));
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, []);

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
        <HeroSectionSystem/>
        
        {/* ===================== GRÁFICO DE FONDO (NUEVO) ===================== */}
        <img src={stationHero} alt="Industrial Node Background" className="system-bg-graphic" />

        {/* ===================== HEADER ===================== */}
        <section id="system-status" className="dashboard-header reveal is-revealed">
          <div className="dashboard-header-text">
            <span className="system-eyebrow">
              <span className={`dot ${statusOnline ? "dot-online" : "dot-offline"}`}></span>
              Monitoring Center
            </span>
            <h1 className="dashboard-title">System Operations</h1>
            {lastUpdate && (
              <div className="dashboard-update">
                Last updated: <span>{lastUpdate}</span>
              </div>
            )}
          </div>
          {/* Eliminamos el div .dashboard-header-visual que estaba aquí */}
        </section>

        {/* ===================== MODULES ===================== */}
        {/* Agregamos position relative para asegurar que queden por encima del fondo */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Indicators speedData={speedData} uptimeData={uptimeData} />
        </div>
        
        {/* ... el resto de tu código (DIGITAL TWIN, PageSpeed, etc.) se queda igual ... */}
        

        {/* ===================== DIGITAL TWIN ===================== */}
        <section style={{ padding: "0 8vw 60px 8vw" }}>
          
          {/* Añadimos position: "relative" directamente aquí para anclar la tarjeta */}
          <div className="digital-twin-card reveal" style={{ position: "relative" }}>
            
            {/* EL STATUS DEBE ESTAR EXACTAMENTE AQUÍ ADENTRO */}
            <ServerStatus checks={checks} />

            <img src={stationGiant} alt="Control Station" className="digital-twin-image" />
            
            <div className="digital-twin-overlay">
              <h3>Active Facility Monitoring</h3>
              <p>Stable connection with all logic controllers.</p>
            </div>
          </div>
          
        </section>
        <PageSpeed speedData={speedData} />
        <Uptime uptimeData={uptimeData} />
        <SystemLogs uptimeData={uptimeData} />
        <Footer/>
      </div>
      
    </>
    
  );
}

export default System;