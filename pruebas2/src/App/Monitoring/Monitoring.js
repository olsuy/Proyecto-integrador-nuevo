// Monitoring.js
import React from "react";
import "./Monitoring.css";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import HeroSectionMonitoring from "./HeroSection/HeroSection";

// Importaciones desde tus carpetas organizadas
import CommandModal from "./CommandModal/CommandModal";
import ElevatorColumn from "./ElevatorColumn/ElevatorColumn";
import useMonitoring from "./UseMonitoring/useMonitoring";

const Monitoring = () => {
  // Desestructuramos el estado y las funciones desde tu Custom Hook
  const {
    elevadorA, 
    elevadorB, 
    loading, 
    error, 
    modal, 
    overrideA, 
    overrideB, 
    sendCommand, 
    closeModal
  } = useMonitoring();

  if (loading) {
    return (
      <>
        <Nav />
        <div className="monitoring-overlay show">
          <div className="monitoring-loader-card">
            <div className="monitoring-loader-ring"></div>
            <p>Connecting to PLC...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="monitoring-container">
          <div className="monitoring-header">
             <h1>System Error</h1>
             <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="monitoring-container">
        <HeroSectionMonitoring/>
        <div className="monitoring-header">
          
          <h1>Control Room</h1>
          <p>Real-Time SCADA Monitoring & Command</p>
        </div>

        <div className="monitoring-comparison-wrapper">
          <ElevatorColumn 
            elevadorId={1} 
            title="Elevator A" 
            data={elevadorA} 
            override={overrideA} 
            onCommand={sendCommand} 
          />
          <ElevatorColumn 
            elevadorId={2} 
            title="Elevator B" 
            data={elevadorB} 
            override={overrideB} 
            onCommand={sendCommand} 
          />
        </div>
        <Footer/>
      </div>

      <CommandModal 
        isOpen={modal.isOpen} 
        title={modal.title} 
        message={modal.message} 
        onClose={closeModal} 
      />
    </>
  );
};

export default Monitoring;