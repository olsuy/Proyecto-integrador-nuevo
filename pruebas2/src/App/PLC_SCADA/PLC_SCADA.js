import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import DashboardCard from "./DashboardCard/DashboardCard";
import IndustryCard from "./Industrycard/Industrycard";
import "./PLC_SCADA.css";
import elevatorImg from "./assets/elevators.jpeg";
import { useNavigate } from "react-router-dom";


gsap.registerPlugin(ScrollTrigger);

const TOTAL_FLOORS = 20;
const DASHBOARD_CARDS = [
  {
    id: "temperature",
    icon: "🌡",
    label: "Temperature",
    getValue: (data) => `${data.temperature}°C`,
    getPercent: (data) => (data.temperature / 30) * 100,
    getStatusClass: (data) => (data.temperature > 25 ? "dot-yellow" : "dot-green"),
  },
  {
    id: "motors",
    icon: "⚙",
    label: "Motor Speed",
    getValue: (data) => `${data.motors}%`,
    getPercent: (data) => data.motors,
    getStatusClass: () => "dot-green",
  },
  {
    id: "energy",
    icon: "⚡",
    label: "Power Consumption",
    getValue: (data) => `${data.energy}%`,
    getPercent: (data) => data.energy,
    getStatusClass: () => "dot-green",
  },
  {
    id: "doors",
    icon: "🚪",
    label: "Door Cycle Health",
    getValue: (data) => `${data.doors}%`,
    getPercent: (data) => data.doors,
    getStatusClass: () => "dot-green",
  },
];

const INDUSTRY_CARDS = [
  {
    title: "Predictive Maintenance",
    text: "Estimated remaining useful life based on motor load and duty-cycle trends.",
    icon: "◇",
    status: "142 DAYS LEFT",
    metaLabel: "Next Inspection",
    metaValue: "Mar 14, 2026",
  },
  {
    title: "Anomaly Detection",
    text: "Continuous comparison against baseline vibration and temperature signatures.",
    icon: "⌁",
    status: "NO ANOMALIES",
    metaLabel: "Recommendation",
    metaValue: "No action required",
  },
  {
    title: "Communication Health",
    text: "Round-trip latency and packet loss across the PLC-to-server network link.",
    icon: "◎",
    status: "STABLE",
    metaLabel: "Recent Faults",
    metaValue: "0 in last 30 days",
  },
  {
    title: "Risk Level",
    text: "Composite score from thermal load, motor wear, and alarm frequency.",
    icon: "⚡",
    status: "LOW RISK",
    metaLabel: "Recommendation",
    metaValue: "Continue standard duty cycle",
  },
];

const HISTORY_FILTERS = ["All", "Alarms", "Faults", "Communication"];

const HISTORY_EVENTS = [
  {
    id: "evt-1",
    time: "14:32:08",
    type: "Alarm",
    description: "Temperature exceeded nominal threshold (26°C)",
    badge: "Resolved",
    badgeClass: "badge-resolved",
  },
  {
    id: "evt-2",
    time: "12:05:41",
    type: "Communication",
    description: "Brief latency spike on PLC-to-server link",
    badge: "Resolved",
    badgeClass: "badge-resolved",
  },
  {
    id: "evt-3",
    time: "09:18:57",
    type: "Fault",
    description: "Door cycle sensor reported delayed close",
    badge: "Investigating",
    badgeClass: "badge-warning",
  },
  {
    id: "evt-4",
    time: "07:44:12",
    type: "Alarm",
    description: "Motor load briefly above 98% during peak traffic",
    badge: "Resolved",
    badgeClass: "badge-resolved",
  },
  {
    id: "evt-5",
    time: "Yesterday",
    type: "Communication",
    description: "Scheduled SCADA server sync completed",
    badge: "Info",
    badgeClass: "badge-info",
  },
  {
    id: "evt-6",
    time: "Yesterday",
    type: "Fault",
    description: "Vibration signature flagged for review, cleared on recheck",
    badge: "Resolved",
    badgeClass: "badge-resolved",
  },
];

function HistoryEvents({ events, filters = HISTORY_FILTERS }) {
  const [historyFilter, setHistoryFilter] = useState("All");
  const listRef = useRef(null);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "All") return events;
    return events.filter((event) => {
      if (historyFilter === "Alarms") return event.type === "Alarm";
      if (historyFilter === "Faults") return event.type === "Fault";
      return event.type === historyFilter;
    });
  }, [events, historyFilter]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const rows = root.querySelectorAll(".reveal");
    rows.forEach((el) => el.classList.add("is-revealed"));
  }, [filteredHistory]);

  return (
    <>
      <div className="history-filters" role="group" aria-label="Filter historical events">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`history-filter ${historyFilter === filter ? "active" : ""}`}
            aria-pressed={historyFilter === filter}
            onClick={() => setHistoryFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="history-list" ref={listRef}>
        {filteredHistory.map((event) => (
          
          <div className="history-row reveal" key={event.id}>
            <span className="history-time">{event.time}</span>
            <span className="history-type">{event.type}</span>
            <span className="history-desc">{event.description}</span>
            <span className={`history-badge ${event.badgeClass}`}>
              {event.badge}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function PLC_SCADA() {
  // ================= REFS =================
  const containerRef = useRef(null);

  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonRef = useRef(null);
  const heroIndicatorsRef = useRef(null);
  const heroLinesRef = useRef(null);

  const elevatorSectionRef = useRef(null);
  const buildingRef = useRef(null);
  const elevatorCabinRef = useRef(null);
  const doorLeftRef = useRef(null);
  const doorRightRef = useRef(null);
  const floorLabelRef = useRef(null);
  const elevatorInfoRef = useRef(null);
  const floorNodesRef = useRef([]); 
  const lastFloorRef = useRef(TOTAL_FLOORS); 
  const lastDoorsRef = useRef(false); 
  const panelRef = useRef(null);

  const dashboardRef = useRef(null);
  const dashboardLineRef = useRef(null);

  const industryRef = useRef(null);

  const historyRef = useRef(null);

  const ctaRef = useRef(null);

  // ================= STATES =================
  const [currentFloor, setCurrentFloor] = useState(TOTAL_FLOORS);
  const [doorsOpen, setDoorsOpen] = useState(false);

  const [systemData, setSystemData] = useState({
    temperature: 24,
    motors: 98,
    energy: 92,
    doors: 100,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  const [plcStatus] = useState({
    system: "ONLINE",
    plc: "RUNNING",
    network: "STABLE",
  });

  // ================= CLOCK =================
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= DYNAMIC SCADA DATA =================
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData({
        temperature: Math.floor(Math.random() * (27 - 22 + 1)) + 22,
        motors: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
        energy: Math.floor(Math.random() * (100 - 85 + 1)) + 85,
        doors: Math.floor(Math.random() * (100 - 99 + 1)) + 99,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // ================= GSAP ANIMATIONS =================
  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---------- HERO ----------
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .fromTo(
          heroLinesRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2 }
        )
        .fromTo(
          heroTitleRef.current,
          { y: 80, opacity: 0, filter: "blur(12px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 },
          "-=0.8"
        )
        .fromTo(
          heroSubtitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.7"
        )
        .fromTo(
          heroButtonRef.current,
          { y: 30, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(
          heroIndicatorsRef.current
            ? heroIndicatorsRef.current.children
            : [],
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          "-=0.5"
        );

    
      gsap.to(heroRef.current, {
        yPercent: 20,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });



      const syncElevator = (progress, instant) => {
    
        gsap.set(buildingRef.current, { yPercent: -75 * progress });

    
        const floor = Math.max(
          1,
          TOTAL_FLOORS - Math.floor(progress * TOTAL_FLOORS)
        );
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
            gsap.to(el, {
              opacity: isLit ? 1 : 0.25,
              duration: instant ? 0 : 0.45,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      };

      ScrollTrigger.create({
        trigger: elevatorSectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // tight coupling to the scrollbar (was 1s of smoothing lag)
        invalidateOnRefresh: true,
        onUpdate: (self) => syncElevator(self.progress, false),
      });

      // Establish the correct initial state immediately (floor 20, doors
      // closed, only the top floor lit) instead of waiting for the first
      // scroll event to run onUpdate.
      syncElevator(0, true);

      // ---------- DASHBOARD CONNECTOR LINE ----------
      // Same technique as a vertical progress line, just horizontal: grows
      // once from the left as the card row scrolls into view.
      gsap.fromTo(
        dashboardLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left left",
          ease: "power2.out",
          duration: 1.1,
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = root.querySelectorAll(".reveal");
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold:0.28,

rootMargin:"0px 0px -10% 0px"}
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // ================= DOOR ANIMATION =================
  useEffect(() => {
    const doorEase = "cubic-bezier(0.65, 0, 0.35, 1)";

    if (doorsOpen) {
      gsap.to(doorLeftRef.current, {
        xPercent: -100,
        duration: 1.1,
        ease: doorEase,
        overwrite: "auto",
      });
      gsap.to(doorRightRef.current, {
        xPercent: 100,
        duration: 1.1,
        ease: doorEase,
        overwrite: "auto",
      });
    } else {
      gsap.to(doorLeftRef.current, {
        xPercent: 0,
        duration: 0.9,
        ease: doorEase,
        overwrite: "auto",
      });
      gsap.to(doorRightRef.current, {
        xPercent: 0,
        duration: 0.9,
        ease: doorEase,
        overwrite: "auto",
      });
    }
  }, [doorsOpen]);

  // ================= HELPERS =================
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const floorsArray = Array.from({ length: TOTAL_FLOORS }, (_, i) => TOTAL_FLOORS - i);

  const hasActiveAlarm = systemData.temperature > 25;

  return (
    <>
      <Nav />

      <div className="plc-scada" ref={containerRef}>
        {/* ===================== HERO ===================== */}
        <section className="hero" ref={heroRef}>
          <div className="hero-lines" ref={heroLinesRef}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="hero-content">
            <h1 className="hero-title" ref={heroTitleRef}>
              Operational Control Center
              <br />
              PLC &amp; SCADA
            </h1>

            <p className="hero-subtitle" ref={heroSubtitleRef}>
              Real-time elevator position, door status, PLC communication,
              and industrial alarms in a single monitoring platform for
              operators, technicians, and engineers.
            </p>

            <button className="hero-button" ref={heroButtonRef}>
              Open Dashboard
            </button>

            <div className="hero-indicators" ref={heroIndicatorsRef}>
              <div className="indicator">
                <span className="dot dot-green"></span>
                SYSTEM ONLINE
              </div>
              <div className="indicator">
                <span className="dot dot-blue"></span>
                PLC CONNECTED
              </div>
              <div className="indicator">
                <span className="dot dot-green"></span>
                SCADA ACTIVE
              </div>
              <div className="indicator">
                <span className="dot dot-blue"></span>
                AI MONITORING
              </div>
            </div>
          </div>

          <div className="hero-scroll-cue">
            <span></span>
            Scroll
          </div>
        </section>

        {/* ===================== ELEVATOR EXPERIENCE ===================== */}
        <section className="elevator-experience" ref={elevatorSectionRef}>
          <div className="elevator-sticky">
            <div
              className="elevator-info reveal reveal-left"
              ref={elevatorInfoRef}
            >
              <span className="eyebrow">01 / System Overview</span>
              <h2>Real-Time Shaft Position</h2>
              <p>
                Each floor is a connected sensor node reporting to the
                central PLC. The cabin position updates live as the elevator
                travels, giving an accurate readout of current floor and
                door state at all times.
              </p>

              <div className="floor-readout">
                <span className="floor-readout-label">Current Floor</span>
                <span className="floor-readout-value" ref={floorLabelRef}>
                  {String(currentFloor).padStart(2, "0")}
                </span>
              </div>

              <div className="door-status">
                <span
                  className={`dot ${doorsOpen ? "dot-green" : "dot-red"}`}
                ></span>
                {doorsOpen ? "DOORS OPEN" : "DOORS CLOSED"}
              </div>
            </div>

            <div className="elevator-center">
              <div className="elevator-cabin" ref={elevatorCabinRef}>
                <img
                  src={elevatorImg}
                  alt="Elevator cabin"
                  className="elevator-img"
                />
                <div className="door doorLeft" ref={doorLeftRef}></div>
                <div className="door doorRight" ref={doorRightRef}></div>
              </div>
            </div>

            <div className="building" ref={buildingRef}>
              {floorsArray.map((floor, i) => (
                <div
                  className="floor"
                  key={floor}
                  ref={(el) => (floorNodesRef.current[i] = el)}
                >
                  <span className="floor-number">
                    Floor {String(floor).padStart(2, "0")}
                  </span>
                  <div className="floor-line"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="plc-panel overview-status" ref={panelRef}>
            <div
              className={`alarm-banner ${hasActiveAlarm ? "alarm-active" : "alarm-clear"}`}
              role={hasActiveAlarm ? "alert" : undefined}
              aria-live={hasActiveAlarm ? "assertive" : undefined}
            >
              <span className={`dot ${hasActiveAlarm ? "dot-yellow" : "dot-green"}`}></span>
              <span className="alarm-banner-label">
                {hasActiveAlarm ? "ACTIVE ALARM" : "NO ACTIVE ALARMS"}
              </span>
              <span className="alarm-banner-detail">
                {hasActiveAlarm
                  ? "Temperature above nominal range — inspection recommended"
                  : "All monitored parameters within normal operating range"}
              </span>
            </div>

            <div className="panel-grid">
              <div className="panel-item reveal">
                <span className="panel-label">System Status</span>
                <span className="panel-value status-green">
                  {plcStatus.system}
                </span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">PLC Status</span>
                <span className="panel-value status-blue">
                  {plcStatus.plc}
                </span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">Current Floor</span>
                <span className="panel-value">
                  {String(currentFloor).padStart(2, "0")}
                </span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">Door State</span>
                <span className={`panel-value ${doorsOpen ? "status-green" : ""}`}>
                  {doorsOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">Communication</span>
                <span className="panel-value status-green">
                  {plcStatus.network}
                </span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">Temperature</span>
                <span className="panel-value">{systemData.temperature}°C</span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">Motor Speed</span>
                <span className="panel-value">{systemData.motors}%</span>
              </div>

              <div className="panel-item reveal">
                <span className="panel-label">Power Consumption</span>
                <span className="panel-value">{systemData.energy}%</span>
              </div>
            </div>

            <div className="clock">
              <span className="clock-label">System Clock</span>
              <span className="clock-value">{formattedTime}</span>
            </div>
          </div>
        </section>

        {/* ===================== DASHBOARD SCADA ===================== */}
        <section className="scada-dashboard" ref={dashboardRef}>
          <span className="eyebrow">02 / Real-Time Monitoring</span>
          <h2>Live Process Variables</h2>

          <div className="dashboard-cards">
            <div className="dashboard-flow-line" ref={dashboardLineRef}></div>
            {DASHBOARD_CARDS.map((card) => (
              <DashboardCard
                key={card.id}
                icon={card.icon}
                label={card.label}
                value={card.getValue(systemData)}
                percent={card.getPercent(systemData)}
                statusClass={card.getStatusClass(systemData)}
              />
            ))}
          </div>
        </section>

        {/* ===================== AI DIAGNOSTICS & MAINTENANCE ===================== */}
        <section className="industry-section" ref={industryRef}>
          <span className="eyebrow">03 / AI Diagnostics &amp; Maintenance</span>
          <h2>Predictive Maintenance</h2>

          <div className="industry-grid">
            {INDUSTRY_CARDS.map((card) => (
              <IndustryCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* ===================== HISTORICAL EVENTS ===================== */}
        <section className="history-section" ref={historyRef}>
          <span className="eyebrow">04 / Historical Events</span>
          <h2>Recent Alarms &amp; Events</h2>

          <HistoryEvents events={HISTORY_EVENTS} filters={HISTORY_FILTERS} />
        </section>

        {/* ===================== CTA FINAL ===================== */}
        <section className="cta-final" ref={ctaRef}>
          <span className="eyebrow reveal">05 / Full Access</span>
          <h2 className="reveal">
            Complete System Access
            <br />
            for Your Shift
          </h2>
          <p className="reveal">
            PLC control, SCADA supervision, alarm history, and AI diagnostics
            in one industrial platform, built for daily operational use.
          </p>
          
          <button className="cta-button reveal">Open Full Dashboard</button>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default PLC_SCADA;