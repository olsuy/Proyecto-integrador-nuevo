import "./Hero.css";
import Nav from "../../Nav/Nav.js";
import fondo from "../fondo.png";
import elevator from "../elevator.png";
import Status_cards from "../Status_cards/st_cards.js"
import PanelInfo from "../panel/panel.js";

function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${fondo})` }}>
      
      <div className="hero-overlay">
        
        <div className="hleft">
          <span className="hsubtitle">
            ELEVATORS
          </span>

          <h1 className="htitle">
            Smart Elevator
            <br />
            <span>Monitoring</span>
          </h1>

          <p className="hdescription">
            Our system provides real-time supervision of industrial
            elevators, collecting and visualizing key data to improve
            efficiency, safety and operational control.
          </p>
        </div>

        <div className="hright">
          <div className="panel">
            <h3>ELEVATOR STATUS</h3>
            
            <img
              src={elevator}
              alt="Elevator"
              className="elevatorimg"
            />

            <div className="status">
              <span className="status_elevator"></span>
              <p>RUNNING</p>
            </div>
            
            <PanelInfo
              className="door"
              title="Door Status"
              value="CLOSED"
            />

            <PanelInfo
              className="floor"
              title="Current Floor"
              value="5"
            />

            <PanelInfo
              className="direction"
              title="Direction"
              value="UP"
            />

            <PanelInfo
              className="speed"
              title="Speed"
              value="1.2 m/s"
            />

            <PanelInfo
              className="update"
              title="Last Update"
              value="10:24 AM"
            />
          </div>
        </div>

      </div>
      
      {/* Las tarjetas ahora fluirán de manera natural debajo del contenido gracias al CSS ajustado */}
      <Status_cards/>   
      
    </section>
  );
}

export default Hero;