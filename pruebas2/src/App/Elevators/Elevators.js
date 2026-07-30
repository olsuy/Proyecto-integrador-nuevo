import { useEffect, useState } from "react";
import './Elevators.css'
import Nav from "../Nav/Nav";
import Card from "./Cards/Cards";
import Hero from "./Hero/hero";
import PanelInfo from "./panel/panel";
import Statistics from "./Status_cards/st_cards";
import Footer from "../Footer/Footer";

function Elevators() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    // Agregamos la clase "elevators-wrapper" aquí
    <div className="elevators-wrapper">
      
      <Nav/>
      {loading && (
        <div className="elevators-overlay show">
          <div className="elevators-loader-card">
            <div className="elevators-loader-ring"></div>
            <p>loading data...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          <Hero />
          
        </>
        
      )}
      <Footer/>
    </div>
  );
}

export default Elevators;