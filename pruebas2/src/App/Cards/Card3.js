import React from "react";
import { Siren, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Card3() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <Siren size={42} strokeWidth={1.8} />
      </div>

      <h3>Active Alarms</h3>
      <p>View current alarms and fault events for fast response and diagnostics.</p>

      {/* Se agregó NavLink y el hash #alarms */}
      <NavLink to="/plc-scada#alarms" className="card-link">
        View <ArrowRight size={18} />
      </NavLink>
    </article>
  );
}