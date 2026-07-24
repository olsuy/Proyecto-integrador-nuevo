import "./st_cards.css";

import Card from "../Cards/Cards";

import ubicacion from "../Cards/ubicacion.png";
import A_B from "../Cards/A_B.png";
import speed from "../Cards/speed.png";
import time from "../Cards/time.png";
import alert from "../Cards/alert.png";

function Statistics(){

    return(

        <section className="statistics">

            <h3 className="statistics-title">
                KEY VARIABLES MONITORED
            </h3>

            <div className="statistics-container">

                <Card
                    icon={ubicacion}
                    title="Position"
                    description="Current floor"
                    value="5"
                    color="#2F80ED"
                />

                <Card
                    icon={A_B}
                    title="Direction"
                    description="Movement direction"
                    value="UP"
                    color="#2F80ED"
                />

               
                <Card
                    icon={speed}
                    title="Speed"
                    description="Elevator velocity"
                    value="1.2 m/s"
                    color="#2F80ED"
                />

                <Card
                    icon={time}
                    title="Travel Time"
                    description="Time between floors"
                    value="00:18"
                    color="#2F80ED"
                />

                <Card
                    icon={alert}
                    title="Alarms"
                    description="Active alerts"
                    value="0"
                    color="#41d96f"
                />

            </div>

        </section>

    );

}

export default Statistics;