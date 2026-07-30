import React, { useEffect, useState } from "react";
import "./Monitoring.css";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { MapPin, DoorOpen, Timer, Wrench } from "lucide-react";

const Monitoring = () => {
  const [elevadorA, setElevadorA] = useState([]);
  const [elevadorB, setElevadorB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchDatabaseData = async () => {
      const startTime = Date.now();

      try {
        const querySQL = `
          SELECT 
            e.nombre_elevador, 
            v.nombre_variable, 
            l.valor_texto, 
            l.valor_numerico, 
            l.valor_booleano, 
            l.fecha_hora
          FROM lecturas_plc l
          INNER JOIN elevadores e ON l.id_elevador = e.id_elevador
          INNER JOIN variables_plc v ON l.id_variable = v.id_variable
          WHERE l.id_lectura IN (
              SELECT MAX(id_lectura) 
              FROM lecturas_plc 
              GROUP BY id_elevador, id_variable
          )
        `;

        const result = await simularEjecucionSQL(querySQL);

        const elevA = result.filter((item) => item.nombre_elevador === 'Elevador A');
        const elevB = result.filter((item) => item.nombre_elevador === 'Elevador B');
        
        setElevadorA(elevA);
        setElevadorB(elevB);
        
      } catch (err) {
        setError("Error executing SQL query: " + err.message);
      } finally {
        const elapsed = Date.now() - startTime;
        const minLoadingTime = 1500;
        const remainingTime = Math.max(minLoadingTime - elapsed, 0);

        await delay(remainingTime);
        setLoading(false);
      }
    };

    fetchDatabaseData();
  }, []);

  const simularEjecucionSQL = async (query) => {
    return [
      { nombre_elevador: 'Elevador A', nombre_variable: 'posicion_actual', valor_numerico: 5, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador A', nombre_variable: 'estado_puertas', valor_texto: 'cerradas', valor_numerico: null, valor_booleano: null },
      { nombre_elevador: 'Elevador A', nombre_variable: 'tiempo_recorrido', valor_numerico: 4.80, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador A', nombre_variable: 'modo_mantenimiento', valor_booleano: 0, valor_texto: null, valor_numerico: null },
      
      { nombre_elevador: 'Elevador B', nombre_variable: 'posicion_actual', valor_numerico: 1, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador B', nombre_variable: 'estado_puertas', valor_texto: 'abiertas', valor_numerico: null, valor_booleano: null },
      { nombre_elevador: 'Elevador B', nombre_variable: 'tiempo_recorrido', valor_numerico: 0.00, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador B', nombre_variable: 'modo_mantenimiento', valor_booleano: 1, valor_texto: null, valor_numerico: null }
    ];
  };

  const getVariableValue = (dataArray, variableName) => {
    const variable = dataArray.find((v) => v.nombre_variable === variableName);
    if (!variable) return "N/A";
    
    // Traducción y ajuste a Title Case (elegante y moderno)
    if (variable.valor_texto !== null) {
      const textVal = variable.valor_texto.toLowerCase();
      if (textVal === 'cerradas') return "Closed";
      if (textVal === 'abiertas') return "Open";
      if (textVal === 'detenido') return "Stopped";
      if (textVal === 'subiendo') return "Going Up";
      if (textVal === 'bajando') return "Going Down";
      // Capitalizar primera letra por defecto
      return textVal.charAt(0).toUpperCase() + textVal.slice(1);
    }
    
    if (variable.valor_numerico !== null) return variable.valor_numerico;
    
    if (variable.valor_booleano !== null) {
      return variable.valor_booleano === 1 ? "Active" : "Inactive";
    }
    
    return "N/A";
  };

  const DashboardCard = ({ title, value, unit, type, Icon }) => {
    let statusClass = "";
    
    if (type === "mantenimiento") {
      statusClass = value === "Active" ? "card-alert" : "card-safe";
    } else if (type === "puertas") {
      statusClass = value === "Open" ? "card-warning" : "card-safe";
    }

    return (
      <div className={`monitoring-card ${statusClass}`}>
        <h3>
          {Icon && <Icon size={22} color="#5bb7ff" strokeWidth={2.5} />} 
          {title}
        </h3>
        <p>
          {value} {unit && <span className="unit">{unit}</span>}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="monitoring-overlay show">
          <div className="monitoring-loader-card">
            <div className="monitoring-loader-ring"></div>
            <p>Connecting to PLC...</p>
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
          <div className="monitoring-header">
             <h1>System Error</h1>
             <p>{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="monitoring-container">
        <div className="monitoring-header">
          <h1>Control Room</h1>
          <p>Real-Time SCADA Monitoring</p>
        </div>

        <div className="monitoring-comparison-wrapper">
          
          <div className="monitoring-column">
            <div className="monitoring-column-title">
              <span>Elevator A</span>
              <span className="status-indicator">● Online</span>
            </div>
            
            <div className="monitoring-grid">
              <DashboardCard 
                Icon={MapPin}
                title="Current Position" 
                value={getVariableValue(elevadorA, 'posicion_actual')} 
                unit="Floor" 
                type="posicion" 
              />
              <DashboardCard 
                Icon={DoorOpen}
                title="Door Status" 
                value={getVariableValue(elevadorA, 'estado_puertas')} 
                type="puertas" 
              />
              <DashboardCard 
                Icon={Timer}
                title="Travel Time" 
                value={getVariableValue(elevadorA, 'tiempo_recorrido')} 
                unit="sec" 
                type="tiempo" 
              />
              <DashboardCard 
                Icon={Wrench}
                title="Maintenance" 
                value={getVariableValue(elevadorA, 'modo_mantenimiento')} 
                type="mantenimiento" 
              />
            </div>
          </div>

          <div className="monitoring-column">
            <div className="monitoring-column-title">
              <span>Elevator B</span>
              <span className="status-indicator">● Online</span>
            </div>
            
            <div className="monitoring-grid">
              <DashboardCard 
                Icon={MapPin}
                title="Current Position" 
                value={getVariableValue(elevadorB, 'posicion_actual')} 
                unit="Floor" 
                type="posicion" 
              />
              <DashboardCard 
                Icon={DoorOpen}
                title="Door Status" 
                value={getVariableValue(elevadorB, 'estado_puertas')} 
                type="puertas" 
              />
              <DashboardCard 
                Icon={Timer}
                title="Travel Time" 
                value={getVariableValue(elevadorB, 'tiempo_recorrido')} 
                unit="sec" 
                type="tiempo" 
              />
              <DashboardCard 
                Icon={Wrench}
                title="Maintenance" 
                value={getVariableValue(elevadorB, 'modo_mantenimiento')} 
                type="mantenimiento" 
              />
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Monitoring;