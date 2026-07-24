import React from "react";
import { ArrowDownUp, ArrowRight } from "lucide-react";

export default function Card2() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <ArrowDownUp size={42} strokeWidth={1.8} />
      </div>

      <h3>Elevator Position</h3>
      <p>Track the current floor location and movement status of each elevator.</p>

      <a href="#" className="card-link">
        View <ArrowRight size={18} />
      </a>
    </article>
  );
}