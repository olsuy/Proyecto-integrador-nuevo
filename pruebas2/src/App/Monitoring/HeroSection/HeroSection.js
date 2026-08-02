import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSectionMonitoring = () => {
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

      // Animación de Parallax al scrollear (se mantiene igual de suave)
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

  // Función para que el botón haga scroll a la siguiente sección (asegúrate de ponerle id="metrics" o el nombre que prefieras a tu sección de abajo)
  const handleScrollDown = () => {
    const nextSection = document.getElementById("metrics");
    if (nextSection) {
      const offset = 100;
      const elementPosition = nextSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    } else {
      // Si aún no tienes la sección de abajo, simplemente baja un poco la pantalla
      window.scrollBy({ top: window.innerHeight - 100, behavior: "smooth" });
    }
  };

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-lines" ref={heroLinesRef}>
        <span></span><span></span><span></span><span></span>
      </div>
      
      <div className="hero-content" ref={contentRef}>
        <h1 className="hero-title" ref={heroTitleRef}>
          Monitoring Control Center
        </h1>
        <p className="hero-subtitle" ref={heroSubtitleRef}>
          Comprehensive oversight of industrial assets, performance metrics, and system diagnostics in real-time for optimal operational efficiency.
        </p>
        
        {/* Cambiamos el NavLink por un botón de acción de scroll */}
        <button 
          className="hero-button" 
          ref={heroButtonRef}
          onClick={handleScrollDown}
        >
          View Live Metrics
        </button>

        <div className="hero-indicators" ref={heroIndicatorsRef}>
          <div className="indicator"><span className="dot dot-green"></span>NETWORK STABLE</div>
          <div className="indicator"><span className="dot dot-blue"></span>DATA LOGGING</div>
          <div className="indicator"><span className="dot dot-green"></span>SENSORS ACTIVE</div>
          <div className="indicator"><span className="dot dot-blue"></span>CLOUD SYNC</div>
        </div>
      </div>
      
      <div className="hero-scroll-cue"><span></span>Scroll</div>
    </section>
  );
};

export default HeroSectionMonitoring;