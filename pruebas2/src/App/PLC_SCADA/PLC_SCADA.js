import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom"; // <-- AGREGAMOS ESTO
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import "./PLC_SCADA.css";

// Módulos
import HeroSection from "./HeroSection/HeroSection";
import ElevatorOverview from "./ElevatorOverview/ElevatorOverview";
import LiveVariables from "./LiveVariables/LiveVariables";
import PredictiveMaintenance from "./PredictiveMaintenance/PredictiveMaintenance";
import HistoryEvents from "./HistoryEvents/HistoryEvents";

function PLC_SCADA() {
  const containerRef = useRef(null);
  const location = useLocation(); // <-- AGREGAMOS EL HOOK PARA EL SCROLL
  
  const [systemData, setSystemData] = useState({});
  const [plcStatus] = useState({ system: "ONLINE", plc: "RUNNING", network: "STABLE" });

  // ================= SCROLL AUTOMÁTICO =================
  // Este efecto detecta si la URL trae un # y baja automáticamente
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Pequeño retraso para dar tiempo a que los módulos carguen
      }
    }
  }, [location]);

  // ================= DYNAMIC SCADA DATA (ThingSpeak API) =================
  useEffect(() => {
    const fetchThingSpeakData = async () => {
      try {
        const response = await fetch(
          "https://api.thingspeak.com/channels/3433907/feeds/last.json?api_key=TJEETPIU13DNG5BG"
        );
        if (response.ok) {
          const result = await response.json();
          setSystemData(prevData => ({ ...prevData, ...result })); 
        }
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    };

    fetchThingSpeakData();
    const interval = setInterval(fetchThingSpeakData, 5000); 
    return () => clearInterval(interval);
  }, []);

  // IntersectionObserver para las animaciones (.reveal) de toda la página
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const targets = root.querySelectorAll(".reveal");
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [systemData]); 

  return (
    <>
      <Nav />
      <div className="plc-scada" ref={containerRef}>
        
        <HeroSection />
        <ElevatorOverview systemData={systemData} plcStatus={plcStatus} />
        <LiveVariables systemData={systemData} />
        <PredictiveMaintenance />
        <HistoryEvents />

        {/* CTA FINAL */}
        <section className="cta-final">
          <span className="eyebrow reveal">05 / Full Access</span>
          <h2 className="reveal">
            Complete System Access<br />for Your Shift
          </h2>
          <p className="reveal">
            PLC control, SCADA supervision, alarm history, and AI diagnostics in one industrial platform, built for daily operational use.
          </p>
          <button className="cta-button reveal">Open Full Dashboard</button>
        </section>
        <Footer />
        
      </div>
    </>
  );
}

export default PLC_SCADA;