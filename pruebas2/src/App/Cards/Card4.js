import React from "react";
import { RefreshCw, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Card4() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <RefreshCw size={42} strokeWidth={1.8} />
      </div>

      <h3>Door Cycles</h3>
      <p>Monitor door opening and closing cycles to evaluate performance and usage.</p>

      {/* Se agregó NavLink y el hash #dashboard */}
      <NavLink to="/plc-scada#dashboard" className="card-link">
        View <ArrowRight size={18} />
      </NavLink>
    </article>
  );
}