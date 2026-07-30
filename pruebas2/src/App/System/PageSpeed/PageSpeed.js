import React, { useEffect, useRef } from 'react';
import './PageSpeed.css';

function AnimatedMetric({ value, decimals, suffix = "", label, index }) {
  const valueRef = useRef(null);

  useEffect(() => {
    if (value === 0 || value === undefined || value === null) return;
    const target = parseFloat(value);
    if (isNaN(target)) return;

    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      if (valueRef.current) valueRef.current.textContent = current.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, decimals]);

  return (
    <div className="speed-card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
      <span className="speed-value">
        <span ref={valueRef}>0</span>{suffix}
      </span>
      <span className="speed-label">{label}</span>
    </div>
  );
}

const PageSpeed = ({ speedData }) => {
  if (!speedData) return null;

  return (
    <section style={{ padding: "0 8vw 60px 8vw" }}>
      <h2 className="reveal" style={{ fontSize: "24px", marginBottom: "30px", borderBottom: "1px solid rgba(86, 216, 255, 0.15)", paddingBottom: "15px" }}>
        Platform Performance (Page Speed)
      </h2>
      
      <div className="speed-grid">
        <AnimatedMetric value={speedData.loadTime} decimals={0} suffix=" ms" label="Load Time" index={0} />
        <AnimatedMetric value={speedData.pageSize} decimals={2} suffix=" KB" label="Page Size" index={1} />
        <AnimatedMetric value={speedData.requests} decimals={0} label="Requests" index={2} />
        <AnimatedMetric value={speedData.score} decimals={0} suffix="/100" label="Performance Grade" index={3} />
      </div>
    </section>
  );
};

export default PageSpeed;