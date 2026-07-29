import React, { useEffect, useRef } from 'react';
import './Indicators.css';

function IndicatorCard({ value, decimals, prefix = "", suffix = "", label, index }) {
  const valueRef = useRef(null);

  useEffect(() => {
    if (value === 0 || value === undefined || value === null) return;
    const target = parseFloat(value);
    if (isNaN(target)) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      if (valueRef.current) valueRef.current.textContent = target.toFixed(decimals);
      return;
    }

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
    <div className="indicator-card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
      <span className="indicator-value">
        {prefix}
        <span ref={valueRef}>0</span>
        {suffix}
      </span>
      <span className="indicator-label">{label}</span>
    </div>
  );
}

const Indicators = ({ uptimeData, speedData }) => {
  return (
    <section style={{ padding: "20px 8vw 60px 8vw", background: "transparent" }}>
      <div className="indicators-grid">
        <IndicatorCard value={uptimeData ? uptimeData.uptimePercent : 0} decimals={2} suffix="%" label="Disponibilidad Global" index={0} />
        <IndicatorCard value={speedData ? speedData.loadTime : 0} decimals={0} suffix=" ms" label="Tiempo de Respuesta" index={1} />
        <IndicatorCard value={speedData ? speedData.score : 0} decimals={0} suffix="/100" label="Performance Grade" index={2} />
        <IndicatorCard value={uptimeData ? uptimeData.outages : 0} decimals={0} label="Interrupciones (7 días)" index={3} />
      </div>
    </section>
  );
};

export default Indicators;