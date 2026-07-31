import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, unit, type, Icon, isEmergency }) => {
  let statusClass = "";
  
  if (isEmergency) {
    statusClass = "card-alert"; 
  } else {
    if (type === "mantenimiento") statusClass = value === "Active" ? "card-alert" : "card-safe";
    else if (type === "puertas") statusClass = (value === "Open" || value === "Opening..." || value === "Closing...") ? "card-warning" : "card-safe";
  }

  return (
    <div className={`monitoring-card ${statusClass}`}>
      <h3>
        {Icon && <Icon size={22} color={isEmergency ? "#ff4d4f" : "#5bb7ff"} strokeWidth={2.5} />} 
        {title}
      </h3>
      <p>
        {isEmergency && type === "tiempo" ? "0.00" : value} {unit && <span className="unit">{unit}</span>}
      </p>
    </div>
  );
};

export default DashboardCard;