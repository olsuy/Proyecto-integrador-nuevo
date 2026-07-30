import React from "react";

import "./Industrycard.css";
function IndustryCard({ title, text, icon, status, metaLabel, metaValue }) {
  return (
    <div className="industry-card reveal">
      <div className="industry-card-top">
        <span className="industry-icon">{icon}</span>
        <span className="industry-status">{status}</span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="industry-card-meta">
        {metaLabel}: <strong>{metaValue}</strong>
      </div>
    </div>
  );
}

export default IndustryCard;