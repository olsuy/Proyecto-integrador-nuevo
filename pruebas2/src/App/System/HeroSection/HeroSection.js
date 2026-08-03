import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSectionSystem = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
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

      // Animación de Parallax al scrollear
      gsap.to(contentRef.current, { 
        y: 150, 
        opacity: 0, 
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top", 
          scrub: 1, 
        },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Función de scroll dinámico hacia la sección de estado del sistema
  const handleScrollDown = () => {
    const nextSection = document.getElementById("system-status");
    if (nextSection) {
      const offset = 100;
      const elementPosition = nextSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight - 100, behavior: "smooth" });
    }
  };

  return (
    // 1. Usamos clases exclusivas para System
    <section className="hero system-hero-section" ref={heroRef}>
      <div className="hero-lines" ref={heroLinesRef}>
        <span></span><span></span><span></span><span></span>
      </div>
      
      {/* 2. Contenedor centrado para System */}
      <div className="hero-content system-center-content" ref={contentRef}>
        <h1 className="hero-title" ref={heroTitleRef}>
          System Operations
        </h1>
        <p className="hero-subtitle" ref={heroSubtitleRef}>
          Real-time tracking of server uptime, API performance, and infrastructure health to ensure maximum reliability across all industrial nodes.
        </p>
        
        {/* Botón adaptado a métricas de servidor */}
        <button 
          className="hero-button" 
          ref={heroButtonRef}
          onClick={handleScrollDown}
        >
          Check Server Health
        </button>

        {/* Indicadores orientados a IT / Infraestructura */}
        <div className="hero-indicators" ref={heroIndicatorsRef}>
          <div className="indicator"><span className="dot dot-green"></span>SERVERS ONLINE</div>
          <div className="indicator"><span className="dot dot-blue"></span>API RESPONSIVE</div>
          <div className="indicator"><span className="dot dot-green"></span>DB CONNECTED</div>
          <div className="indicator"><span className="dot dot-blue"></span>NO OUTAGES</div>
        </div>
      </div>
      
      <div className="hero-scroll-cue"><span></span>Scroll</div>
    </section>
  );
};

export default HeroSectionSystem;