import React from "react";
import { Siren, ArrowRight } from "lucide-react";

export default function Card3() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <Siren size={42} strokeWidth={1.8} />
      </div>

      <h3>Active Alarms</h3>
      <p>View current alarms and fault events for fast response and diagnostics.</p>

      <a href="#" className="card-link">
        View <ArrowRight size={18} />
      </a>
    </article>
  );
}