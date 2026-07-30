import React from "react";
import IndustryCard from "../Industrycard/Industrycard";
import { Activity, Zap, Wifi, ShieldAlert } from 'lucide-react';
import "./PredictiveMaintenance.css";

const INDUSTRY_CARDS = [
  { title: "Predictive Maintenance", text: "Estimated remaining useful life based on motor load and duty-cycle trends.", icon: <Activity size={28} />, status: "142 DAYS LEFT", metaLabel: "Next Inspection", metaValue: "Mar 14, 2026" },
  { title: "Anomaly Detection", text: "Continuous comparison against baseline vibration and temperature signatures.", icon: <Zap size={28} />, status: "NO ANOMALIES", metaLabel: "Recommendation", metaValue: "No action required" },
  { title: "Communication Health", text: "Round-trip latency and packet loss across the PLC-to-server network link.", icon: <Wifi size={28} />, status: "STABLE", metaLabel: "Recent Faults", metaValue: "0 in last 30 days" },
  { title: "Risk Level", text: "Composite score from thermal load, motor wear, and alarm frequency.", icon: <ShieldAlert size={28} />, status: "LOW RISK", metaLabel: "Recommendation", metaValue: "Continue standard duty cycle" },
];

const PredictiveMaintenance = () => {
  return (
    <section className="industry-section">
      <span className="eyebrow">03 / AI Diagnostics &amp; Maintenance</span>
      <h2>Predictive Maintenance</h2>
      <div className="industry-grid">
        {INDUSTRY_CARDS.map((card) => (
          <IndustryCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
};

export default PredictiveMaintenance;