// En ElevatorColumn/ElevatorColumn.js
import React from 'react';
import { MapPin, DoorOpen, Timer, Wrench } from "lucide-react";
import './ElevatorColumn.css'; 

// Las rutas dependerán de dónde pusiste DashboardCard y ControlPanel.
// Si las pusiste sueltas en la carpeta Monitoring, debes subir un nivel con "../"
import DashboardCard from "../DashboardCard/DashboardCard"; 
import ControlPanel from "../ControlPanels/ControlPanel";   
import { getVariableValue } from "../MonitoringUtils/monitoringUtils"; // Subimos un nivel y entramos a tu carpeta

const ElevatorColumn = ({ elevadorId, title, data, override, onCommand }) => {
  return (
    <div className="monitoring-column">
      <div className="monitoring-column-title">
        <span>{title}</span>
        <span className="status-indicator" style={override.emergencia ? {color: '#ff4d4f', borderColor: '#ff4d4f', background: 'rgba(255,77,79,0.1)'} : {}}>
          {override.emergencia ? "● E-STOP" : "● ONLINE"}
        </span>
      </div>
      
      <div className="monitoring-grid">
        <DashboardCard Icon={MapPin} title="Current Position" value={getVariableValue(data, 'posicion_actual')} unit="Floor" type="posicion" isEmergency={override.emergencia} />
        <DashboardCard Icon={DoorOpen} title="Door Status" value={getVariableValue(data, 'estado_puertas')} type="puertas" isEmergency={override.emergencia} />
        <DashboardCard Icon={Timer} title="Travel Time" value={getVariableValue(data, 'tiempo_recorrido')} unit="sec" type="tiempo" isEmergency={override.emergencia} />
        <DashboardCard Icon={Wrench} title="Maintenance" value={getVariableValue(data, 'modo_mantenimiento')} type="mantenimiento" isEmergency={override.emergencia} />
      </div>

      <ControlPanel elevadorId={elevadorId} override={override} onCommand={onCommand} />
    </div>
  );
};

export default ElevatorColumn;