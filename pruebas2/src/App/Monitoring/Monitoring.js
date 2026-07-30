import React, { useEffect, useState } from "react";
import "./Monitoring.css";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

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
        // Aquí debes colocar la URL de tu API local que ejecuta "SELECT * FROM vista_dashboard_comparativo"
        const response = await fetch("http://localhost:3000/api/dashboard");

        if (!response.ok) {
          throw new Error("No hay conexión con la base de datos");
        }

        const result = await response.json();
        
        // Separamos los datos por elevador basándonos en tu base de datos SQL
        const elevA = result.filter((item) => item.nombre_elevador === 'Elevador A');
        const elevB = result.filter((item) => item.nombre_elevador === 'Elevador B');
        
        setElevadorA(elevA);
        setElevadorB(elevB);
        
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

    fetchDatabaseData();
  }, []);

  if (loading) {
    return (
      <>
        <Nav />
        <div className="monitoring-overlay show">
          <div className="monitoring-loader-card">
            <div className="monitoring-loader-ring"></div>
            <p>Cargando datos del PLC...</p>
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
          <h1>Dashboard Comparativo Técnico</h1>
          <p>Error: {error}</p>
        </div>
      </>
    );
  }

  // Función auxiliar para buscar el valor correcto de la variable (ya sea texto, numérico o booleano)
  const getVariableValue = (dataArray, variableName) => {
    const variable = dataArray.find((v) => v.nombre_variable === variableName);
    if (!variable) {
      return "N/A";
    }
    if (variable.valor_texto !== null) {
      return variable.valor_texto;
    }
    if (variable.valor_numerico !== null) {
      return variable.valor_numerico;
    }
    if (variable.valor_booleano !== null) {
      if (variable.valor_booleano === 1) {
        return "Activo";
      } else {
        return "Inactivo";
      }
    }
    return "N/A";
  };

  return (
    <>
      <Nav />
      <div className="monitoring-container">
        <h1>Dashboard Comparativo Técnico</h1>
        <p>Monitoreo en tiempo real - Base de Datos Local</p>

        <div className="monitoring-comparison-wrapper">
          
          {/* Columna Elevador A */}
          <div className="monitoring-column">
            <h2>Elevador A (Principal)</h2>
            <div className="monitoring-grid">
              <div className="monitoring-card">
                <h3>Posición Actual</h3>
                <p>{getVariableValue(elevadorA, 'posicion_actual')} Piso</p>
              </div>
              <div className="monitoring-card">
                <h3>Estado Puertas</h3>
                <p>{getVariableValue(elevadorA, 'estado_puertas')}</p>
              </div>
              <div className="monitoring-card">
                <h3>Tiempo de Recorrido</h3>
                <p>{getVariableValue(elevadorA, 'tiempo_recorrido')} s</p>
              </div>
              <div className="monitoring-card">
                <h3>Modo Mantenimiento</h3>
                <p>{getVariableValue(elevadorA, 'modo_mantenimiento')}</p>
              </div>
            </div>
          </div>

          {/* Columna Elevador B */}
          <div className="monitoring-column">
            <h2>Elevador B (Secundario)</h2>
            <div className="monitoring-grid">
              <div className="monitoring-card">
                <h3>Posición Actual</h3>
                <p>{getVariableValue(elevadorB, 'posicion_actual')} Piso</p>
              </div>
              <div className="monitoring-card">
                <h3>Estado Puertas</h3>
                <p>{getVariableValue(elevadorB, 'estado_puertas')}</p>
              </div>
              <div className="monitoring-card">
                <h3>Tiempo de Recorrido</h3>
                <p>{getVariableValue(elevadorB, 'tiempo_recorrido')} s</p>
              </div>
              <div className="monitoring-card">
                <h3>Modo Mantenimiento</h3>
                <p>{getVariableValue(elevadorB, 'modo_mantenimiento')}</p>
              </div>
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Monitoring;