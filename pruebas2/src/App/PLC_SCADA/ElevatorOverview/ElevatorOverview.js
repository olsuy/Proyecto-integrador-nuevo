import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import elevatorImg from "../assets/elevators.jpeg";


gsap.registerPlugin(ScrollTrigger);

const TOTAL_FLOORS = 20;
const floorsArray = Array.from({ length: TOTAL_FLOORS }, (_, i) => TOTAL_FLOORS - i);

const ElevatorOverview = ({ systemData, plcStatus }) => {
  const sectionRef = useRef(null);
  const buildingRef = useRef(null);
  const elevatorCabinRef = useRef(null);
  const doorLeftRef = useRef(null);
  const doorRightRef = useRef(null);
  const floorLabelRef = useRef(null);
  const floorNodesRef = useRef([]); 
  const lastFloorRef = useRef(TOTAL_FLOORS); 
  const lastDoorsRef = useRef(false); 

  const [currentFloor, setCurrentFloor] = useState(TOTAL_FLOORS);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Reloj local (Optimización de rendimiento)
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const hasActiveAlarm = Boolean(
    systemData.field5 && systemData.field5.trim() !== "0" && systemData.field5.trim().toLowerCase() !== "none"
  );

  // Animación del elevador al scrollear
  useEffect(() => {
    const ctx = gsap.context(() => {
      const syncElevator = (progress, instant) => {
        gsap.set(buildingRef.current, { yPercent: -75 * progress });

        const floor = Math.max(1, TOTAL_FLOORS - Math.floor(progress * TOTAL_FLOORS));
        if (floor !== lastFloorRef.current) {
          lastFloorRef.current = floor;
          setCurrentFloor(floor);
        }

        const open = progress > 0.50;
        if (open !== lastDoorsRef.current) {
          lastDoorsRef.current = open;
          setDoorsOpen(open);
        }

        const activeIndex = Math.floor(progress * TOTAL_FLOORS);
        floorNodesRef.current.forEach((el, i) => {
          if (!el) return;
          const isLit = i <= activeIndex;
          if (el.dataset.lit !== String(isLit)) {
            el.dataset.lit = String(isLit);
            gsap.to(el, { opacity: isLit ? 1 : 0.25, duration: instant ? 0 : 0.45, ease: "power2.out", overwrite: "auto" });
          }
        });
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => syncElevator(self.progress, false),
      });

      syncElevator(0, true);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animación de Puertas
  useEffect(() => {
    const doorEase = "cubic-bezier(0.65, 0, 0.35, 1)";
    if (doorsOpen) {
      gsap.to(doorLeftRef.current, { xPercent: -100, duration: 1.1, ease: doorEase, overwrite: "auto" });
      gsap.to(doorRightRef.current, { xPercent: 100, duration: 1.1, ease: doorEase, overwrite: "auto" });
    } else {
      gsap.to(doorLeftRef.current, { xPercent: 0, duration: 0.9, ease: doorEase, overwrite: "auto" });
      gsap.to(doorRightRef.current, { xPercent: 0, duration: 0.9, ease: doorEase, overwrite: "auto" });
    }
  }, [doorsOpen]);

  return (
    <section id="position" className="elevator-experience" ref={sectionRef}>
      <div className="elevator-sticky">
        <div className="elevator-info reveal reveal-left">
          <span className="eyebrow">01 / System Overview</span>
          <h2>Real-Time Shaft Position</h2>
          <p>Each floor is a connected sensor node reporting to the central PLC...</p>
          <div className="floor-readout">
            <span className="floor-readout-label">Current Floor</span>
            <span className="floor-readout-value" ref={floorLabelRef}>{String(currentFloor).padStart(2, "0")}</span>
          </div>
          <div className="door-status">
            <span className={`dot ${doorsOpen ? "dot-green" : "dot-red"}`}></span>
            {doorsOpen ? "DOORS OPEN" : "DOORS CLOSED"}
          </div>
        </div>

        <div className="elevator-center">
          <div className="elevator-cabin" ref={elevatorCabinRef}>
            <img src={elevatorImg} alt="Elevator cabin" className="elevator-img" />
            <div className="door doorLeft" ref={doorLeftRef}></div>
            <div className="door doorRight" ref={doorRightRef}></div>
          </div>
        </div>

        <div className="building" ref={buildingRef}>
          {floorsArray.map((floor, i) => (
            <div className="floor" key={floor} ref={(el) => (floorNodesRef.current[i] = el)}>
              <span className="floor-number">Floor {String(floor).padStart(2, "0")}</span>
              <div className="floor-line"></div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="plc-panel overview-status">
        <div className={`alarm-banner ${hasActiveAlarm ? "alarm-active" : "alarm-clear"}`}>
          <span className={`dot ${hasActiveAlarm ? "dot-yellow" : "dot-green"}`}></span>
          <span className="alarm-banner-label">{hasActiveAlarm ? "ACTIVE ALARM" : "NO ACTIVE ALARMS"}</span>
          <span className="alarm-banner-detail">
            {hasActiveAlarm ? "Temperature or sensor alert active — inspection recommended" : "All monitored parameters within normal operating range"}
          </span>
        </div>

        <div className="panel-grid">
          <div className="panel-item reveal"><span className="panel-label">System Status</span><span className="panel-value status-green">{plcStatus.system}</span></div>
          <div className="panel-item reveal"><span className="panel-label">PLC Status</span><span className="panel-value status-blue">{plcStatus.plc}</span></div>
          <div className="panel-item reveal"><span className="panel-label">Current Floor</span><span className="panel-value">{String(currentFloor).padStart(2, "0")}</span></div>
          <div className="panel-item reveal"><span className="panel-label">Door State</span><span className={`panel-value ${doorsOpen ? "status-green" : ""}`}>{doorsOpen ? "OPEN" : "CLOSED"}</span></div>
          <div className="panel-item reveal"><span className="panel-label">Communication</span><span className="panel-value status-green">{plcStatus.network}</span></div>
          <div className="panel-item reveal"><span className="panel-label">Temperature</span><span className="panel-value">{systemData.field1 ? "24" : "0"}°C</span></div>
          <div className="panel-item reveal"><span className="panel-label">Motor Speed</span><span className="panel-value">{systemData.field3 || "0"}%</span></div>
          <div className="panel-item reveal"><span className="panel-label">Power Consumption</span><span className="panel-value">92%</span></div>
        </div>

        <div className="clock">
          <span className="clock-label">System Clock</span>
          <span className="clock-value">{formattedTime}</span>
        </div>
      </div>
    </section>
  );
};

export default ElevatorOverview;