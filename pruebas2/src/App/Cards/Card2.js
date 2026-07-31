import React from "react";
import { ArrowDownUp, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Card2() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <ArrowDownUp size={42} strokeWidth={1.8} />
      </div>

      <h3>Elevator Position</h3>
      <p>Track the current floor location and movement status of each elevator.</p>

      {/* Se agregó NavLink y el hash #position */}
      <NavLink to="/plc-scada#position" className="card-link">
        View <ArrowRight size={18} />
      </NavLink>
    </article>
  );
}