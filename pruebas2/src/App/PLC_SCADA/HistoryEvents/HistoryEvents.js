import React, { useState, useMemo, useEffect, useRef } from "react";


const HISTORY_FILTERS = ["All", "Alarms", "Faults", "Communication"];

const HISTORY_EVENTS = [
  { id: "evt-1", time: "14:32:08", type: "Alarm", description: "Temperature exceeded nominal threshold (26°C)", badge: "Resolved", badgeClass: "badge-resolved" },
  { id: "evt-2", time: "12:05:41", type: "Communication", description: "Brief latency spike on PLC-to-server link", badge: "Resolved", badgeClass: "badge-resolved" },
  { id: "evt-3", time: "09:18:57", type: "Fault", description: "Door cycle sensor reported delayed close", badge: "Investigating", badgeClass: "badge-warning" },
  { id: "evt-4", time: "07:44:12", type: "Alarm", description: "Motor load briefly above 98% during peak traffic", badge: "Resolved", badgeClass: "badge-resolved" },
  { id: "evt-5", time: "Yesterday", type: "Communication", description: "Scheduled SCADA server sync completed", badge: "Info", badgeClass: "badge-info" },
  { id: "evt-6", time: "Yesterday", type: "Fault", description: "Vibration signature flagged for review, cleared on recheck", badge: "Resolved", badgeClass: "badge-resolved" },
];

const HistoryEvents = () => {
  const [historyFilter, setHistoryFilter] = useState("All");
  const listRef = useRef(null);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "All") return HISTORY_EVENTS;
    return HISTORY_EVENTS.filter((event) => {
      if (historyFilter === "Alarms") return event.type === "Alarm";
      if (historyFilter === "Faults") return event.type === "Fault";
      return event.type === historyFilter;
    });
  }, [historyFilter]);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const rows = root.querySelectorAll(".reveal");
    rows.forEach((el) => el.classList.add("is-revealed"));
  }, [filteredHistory]);

  return (
    <section id="alarms" className="history-section">
      <span className="eyebrow">04 / Historical Events</span>
      <h2>Recent Alarms &amp; Events</h2>
      
      <div className="history-filters" role="group" aria-label="Filter historical events">
        {HISTORY_FILTERS.map((filter) => (
          <button
            key={filter} type="button"
            className={`history-filter ${historyFilter === filter ? "active" : ""}`}
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
            <span className={`history-badge ${event.badgeClass}`}>{event.badge}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HistoryEvents;