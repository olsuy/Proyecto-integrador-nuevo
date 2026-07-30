import React from "react";
import "./DashboardCard.css";
function DashboardCard({ icon, label, value, percent, statusClass = "dot-green" }) {
  return (
    <div className="dashboard-card reveal">
      <div className="card-top">
        <span className="card-icon">{icon}</span>
        <span className={`dot ${statusClass}`}></span>
      </div>
      <span className="card-label">{label}</span>
      <span className="card-value">{value}</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

export default DashboardCard;