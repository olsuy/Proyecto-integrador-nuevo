// CommandModal.js
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react'; 
import "./CommandModal.css"

const CommandModal = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;

  // Verificamos si es una alerta de emergencia para pintar todo de rojo
  const isEmergency = title === "Emergency Alert";

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div 
          className="modal-icon-container" 
          style={isEmergency ? { borderColor: '#ff4d4f', background: 'rgba(255,77,79,0.1)' } : {}}
        >
          {isEmergency ? (
            <AlertTriangle size={42} color="#ff4d4f" strokeWidth={2} />
          ) : (
            <CheckCircle size={42} color="#5bb7ff" strokeWidth={2} />
          )}
        </div>
        
        <h2 style={isEmergency ? { color: '#ff4d4f' } : {}}>{title}</h2>
        
        {/* Cambiamos la caja de código por texto descriptivo elegante */}
        <div style={{ fontSize: '1.1rem', color: '#b5b5b5', marginBottom: '30px', lineHeight: '1.5' }}>
          {message}
        </div>
        
        <button 
          className="modal-btn" 
          style={isEmergency ? { background: '#ff4d4f' } : {}} 
          onClick={onClose}
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default CommandModal;