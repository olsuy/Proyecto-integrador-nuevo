import React from "react";
import { RefreshCw, ArrowRight } from "lucide-react";

export default function Card4() {
  return (
    <article className="monitor-card">
      <div className="icon-wrap">
        <RefreshCw size={42} strokeWidth={1.8} />
      </div>

      <h3>Door Cycles</h3>
      <p>Monitor door opening and closing cycles to evaluate performance and usage.</p>

      <a href="#" className="card-link">
        View <ArrowRight size={18} />
      </a>
    </article>
  );
}