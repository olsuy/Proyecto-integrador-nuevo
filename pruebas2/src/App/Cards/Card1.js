import React from "react";
import { SquareActivity, ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Card1() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <SquareActivity size={42} strokeWidth={1.8} />
      </div>

      <h3>Current Status</h3>
      <p>Real-time overview of elevator operating condition and system activity.</p>

      <NavLink to="/plc-scada#position" className="card-link">
        <a className="card-link">
          View <ArrowRight size={18} />
        </a>
      </NavLink>
    </article>
  );
}