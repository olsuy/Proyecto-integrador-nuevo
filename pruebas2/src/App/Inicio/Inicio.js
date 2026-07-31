import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import "./Inicio.css";

import slide1 from "./Images/slide1.png";
import slide2 from "./Images/slide2.jpg";
import slide3 from "./Images/slide3.jpg";
import { NavLink } from "react-router-dom";

const slides = [
  {
    image: slide1,
    title: "Elevator",
    subtitle: "MONITORING",
    description:
      "A web platform for monitoring critical variables, events and real-time elevator operation.",
  },
  {
    image: slide2,
    title: "Smart",
    subtitle: "CONTROL",
    description:
      "Advanced monitoring solutions designed for efficiency and safety.",
  },
  {
    image: slide3,
    title: "Real Time",
    subtitle: "ANALYTICS",
    description:
      "Visualize elevator performance with intelligent data.",
  },
];

const titleAnimation = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1 },
};

const textAnimation = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.3 },
};

function Inicio() {
  const [current, setCurrent] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    setMouse({ x, y });
  };

  const handleSelectSlide = (index) => {
    setCurrent(index);
  };

  return (
    <section
      className="inicio"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {slides.map((slide, index) => (
        <motion.div
          key={index}
          className={`background ${index === current ? "active" : ""}`}
          style={{
            backgroundImage: `url(${slide.image})`,
            transform: `scale(1.12) translate(${mouse.x / 4}px, ${mouse.y / 4}px)`,
          }}
        />
      ))}

      <div className="overlay">
        <div className="contenido">
          <motion.h1
            key={current}
            initial={titleAnimation.initial}
            animate={titleAnimation.animate}
            transition={titleAnimation.transition}
          >
            <span>{slides[current].title}</span>
            <strong>{slides[current].subtitle}</strong>
          </motion.h1>

          <motion.p
            key={`p-${current}`}
            initial={textAnimation.initial}
            animate={textAnimation.animate}
            transition={textAnimation.transition}
          >
            {slides[current].description}
          </motion.p>
          <NavLink to ="monitoring">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Dashboard
          
            
            <span>→</span>
          </motion.button>
          </NavLink>
        </div>
      </div>

      <div className="timeline">
        {slides.map((_, index) => (
          <div
            key={index}
            className="line"
            onClick={() => handleSelectSlide(index)}
          >
            {index === current && <div className="line-active" />}
            <span>{`0${index + 1}`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Inicio;