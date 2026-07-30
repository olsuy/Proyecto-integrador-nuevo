import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonRef = useRef(null);
  const heroIndicatorsRef = useRef(null);
  const heroLinesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      heroTl
        .fromTo(heroLinesRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 })
        .fromTo(heroTitleRef.current, { y: 80, opacity: 0, filter: "blur(12px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 }, "-=0.8")
        .fromTo(heroSubtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.7")
        .fromTo(heroButtonRef.current, { y: 30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.8 }, "-=0.6")
        .fromTo(heroIndicatorsRef.current ? heroIndicatorsRef.current.children : [], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 }, "-=0.5");

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
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-lines" ref={heroLinesRef}>
        <span></span><span></span><span></span><span></span>
      </div>
      <div className="hero-content">
        <h1 className="hero-title" ref={heroTitleRef}>
          Operational Control Center<br />PLC &amp; SCADA
        </h1>
        <p className="hero-subtitle" ref={heroSubtitleRef}>
          Real-time elevator position, door status, PLC communication, and industrial alarms in a single monitoring platform for operators, technicians, and engineers.
        </p>
        <button className="hero-button" ref={heroButtonRef}>Open Dashboard</button>
        <div className="hero-indicators" ref={heroIndicatorsRef}>
          <div className="indicator"><span className="dot dot-green"></span>SYSTEM ONLINE</div>
          <div className="indicator"><span className="dot dot-blue"></span>PLC CONNECTED</div>
          <div className="indicator"><span className="dot dot-green"></span>SCADA ACTIVE</div>
          <div className="indicator"><span className="dot dot-blue"></span>AI MONITORING</div>
        </div>
      </div>
      <div className="hero-scroll-cue"><span></span>Scroll</div>
    </section>
  );
};

export default HeroSection;