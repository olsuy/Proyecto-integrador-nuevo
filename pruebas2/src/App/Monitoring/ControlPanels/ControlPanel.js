import React from 'react';
import { DoorOpen, Wrench, Power, AlertTriangle } from 'lucide-react';
import './ControlPanel.css'; 

const ControlPanel = ({ elevadorId, override, onCommand }) => {
  return (
    <div className="control-panel">
      <button 
        className="control-btn btn-warning" 
        onClick={() => onCommand(elevadorId, 'mantenimiento', 'modo_mantenimiento', null, override.mantenimiento === 1 ? 0 : 1)}
      >
        <Wrench size={18}/> {override.mantenimiento === 1 ? "Exit Maint." : "Enter Maint."}
      </button>
      
      <button 
        className="control-btn btn-action" 
        onClick={() => onCommand(elevadorId, 'puertas', 'estado_puertas', 'abiertas', null)}
      >
        <DoorOpen size={18}/> Force Open
      </button>
      
      <button 
        className="control-btn btn-danger" 
        onClick={() => onCommand(elevadorId, 'emergencia', 'estado_operacion', 'detenido', !override.emergencia)}
      >
        {override.emergencia ? <Power size={18}/> : <AlertTriangle size={18}/>} 
        {override.emergencia ? "Reset" : "E-Stop"}
      </button>
    </div>
  );
};

export default ControlPanel;