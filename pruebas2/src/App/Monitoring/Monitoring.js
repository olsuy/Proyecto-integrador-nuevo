import React, { useEffect, useState } from "react";
import "./Monitoring.css";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

const CHANNEL_ID = "3433907";
const READ_API_KEY = "TJEETPIU13DNG5BG";

const Monitoring = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchThingSpeakData = async () => {
      const startTime = Date.now();

      try {
        const response = await fetch(
          `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${READ_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("No hay info de la API");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        const elapsed = Date.now() - startTime;
        const minLoadingTime = 2000;
        const remainingTime = Math.max(minLoadingTime - elapsed, 0);

        await delay(remainingTime);
        setLoading(false);
      }
    };

    fetchThingSpeakData();
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="monitoring-overlay show">
          <div className="monitoring-loader-card">
            <div className="monitoring-loader-ring"></div>
            <p>Loading data...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="monitoring-container">
          <h1>Monitoring</h1>
          <p>Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="monitoring-container">
        <h1>Monitoring</h1>
        <p>Powered by ThingSpeak</p>

        <div className="monitoring-grid">
          <div className="monitoring-card">
            <h3>Current Floor</h3>
            <p>{data?.field1 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Direction</h3>
            <p>{data?.field2 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Speed</h3>
            <p>{data?.field3 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Door Status</h3>
            <p>{data?.field4 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Active Alarms</h3>
            <p>{data?.field5 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Travel Time</h3>
            <p>{data?.field6 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Elevator Status</h3>
            <p>{data?.field7 || "N/A"}</p>
          </div>

          <div className="monitoring-card">
            <h3>Last Update</h3>
            <p>{data?.field8 || data?.created_at || "N/A"}</p>
          </div>
        </div>
        <Footer/>
      </div>
      
    </>
  );
};

export default Monitoring;