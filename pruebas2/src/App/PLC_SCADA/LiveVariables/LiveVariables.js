import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DashboardCard from "../DashboardCard/DashboardCard";
import { Building, ArrowUpDown, Gauge, DoorOpen } from 'lucide-react';
import "./LiveVariables.css";

gsap.registerPlugin(ScrollTrigger);

const DASHBOARD_CARDS = [
  {
    id: "floor", icon: <Building size={22} />, label: "Current Floor",
    getValue: (data) => data.field1 || "N/A",
    getPercent: (data) => (Number(data.field1) / 20) * 100 || 0, 
    getStatusClass: () => "dot-green",
  },
  {
    id: "direction", icon: <ArrowUpDown size={22} />, label: "Direction",
    getValue: (data) => data.field2 || "N/A", getPercent: () => 100, getStatusClass: () => "dot-green",
  },
  {
    id: "speed", icon: <Gauge size={22} />, label: "Speed",
    getValue: (data) => `${data.field3 || "0"}`,
    getPercent: (data) => (Number(data.field3) / 100) * 100 || 0,
    getStatusClass: () => "dot-blue",
  },
  {
    id: "doors", icon: <DoorOpen size={22} />, label: "Door Status",
    getValue: (data) => data.field4 || "N/A",
    getPercent: (data) => (data.field4 === "OPEN" ? 100 : 0),
    getStatusClass: (data) => (data.field4 === "OPEN" ? "dot-yellow" : "dot-green"),
  },
];

const LiveVariables = ({ systemData }) => {
  const dashboardRef = useRef(null);
  const dashboardLineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dashboardLineRef.current,
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: "left left", ease: "power2.out", duration: 1.1,
          scrollTrigger: { trigger: dashboardRef.current, start: "top 70%", toggleActions: "play none none reverse" }
        }
      );
    }, dashboardRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="scada-dashboard" ref={dashboardRef}>
      <span className="eyebrow">02 / Real-Time Monitoring</span>
      <h2>Live Process Variables</h2>
      <div className="dashboard-cards">
        <div className="dashboard-flow-line" ref={dashboardLineRef}></div>
        {DASHBOARD_CARDS.map((card) => (
          <DashboardCard
            key={card.id} icon={card.icon} label={card.label}
            value={card.getValue(systemData)} percent={card.getPercent(systemData)} statusClass={card.getStatusClass(systemData)}
          />
        ))}
      </div>
    </section>
  );
};

export default LiveVariables;