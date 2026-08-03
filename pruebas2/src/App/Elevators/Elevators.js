import { useEffect, useState } from "react";
import './Elevators.css'
import Nav from "../Nav/Nav";
// Eliminamos la importación del Hero viejo
import Card from "./Cards/Cards";
import PanelInfo from "./panel/panel";
import Statistics from "./Status_cards/st_cards";
import Footer from "../Footer/Footer";
import HeroSectionElevators from "./HeroSection/HeroSection";

function Elevators() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
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

      {/* Renderizamos el contenido solo cuando termina de cargar */}
      {!loading && (
        <>
          {/* Aquí queda tu nuevo Hero exclusivo */}
          <HeroSectionElevators/>
          
          {/* Asegúrate de ponerle este ID al contenedor de tus tarjetas para que el botón de scroll funcione */}
          <div id="elevators-status">
             {/* <Card />
                 <PanelInfo />
                 <Statistics /> 
                 (Descomenta tus otros componentes aquí cuando los necesites) */}
          </div>
        </>
      )}
      
      <Footer/>
    </div>
  );
}

export default Elevators;