import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HeroSectionElevators = () => {
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

  // Función para hacer scroll hacia la sección de los elevadores
  const handleScrollDown = () => {
    const nextSection = document.getElementById("elevators-status");
    if (nextSection) {
      const offset = 100;
      const elementPosition = nextSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight - 100, behavior: "smooth" });
    }
  };

  return (
    // Clases exclusivas para evitar choques con Monitoring o System
    <section className="hero elevators-hero-section" ref={heroRef}>
      <div className="hero-lines" ref={heroLinesRef}>
        <span></span><span></span><span></span><span></span>
      </div>
      
      <div className="hero-content elevators-center-content" ref={contentRef}>
        <h1 className="hero-title" ref={heroTitleRef}>
          Elevator Control Center
        </h1>
        
        <p className="hero-subtitle" ref={heroSubtitleRef}>
          Real-time tracking of cabin positions, door mechanics, and motor diagnostics for all industrial elevator units.
        </p>
        
        <button 
          className="hero-button" 
          ref={heroButtonRef}
          onClick={handleScrollDown}
        >
          View Cabin Status
        </button>

        {/* Indicadores orientados a los elevadores */}
        <div className="hero-indicators" ref={heroIndicatorsRef}>
          <div className="indicator"><span className="dot dot-green"></span>MOTORS SYNCED</div>
          <div className="indicator"><span className="dot dot-blue"></span>CABINS ACTIVE</div>
          <div className="indicator"><span className="dot dot-green"></span>DOORS SECURED</div>
          <div className="indicator"><span className="dot dot-blue"></span>PLC LINKED</div>
        </div>
      </div>
      
      <div className="hero-scroll-cue"><span></span>Scroll</div>
    </section>
  );
};

export default HeroSectionElevators;