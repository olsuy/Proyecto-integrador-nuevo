import React, { useEffect, useState } from "react";
import "./Monitoring.css";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { MapPin, DoorOpen, Timer, Wrench, Power, AlertTriangle } from "lucide-react";

const Monitoring = () => {
  const [elevadorA, setElevadorA] = useState([]);
  const [elevadorB, setElevadorB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para forzar sobrescritura manual (Simulando el envío de comandos al PLC)
  const [overrideA, setOverrideA] = useState({ mantenimiento: null, puertas: null, emergencia: false });
  const [overrideB, setOverrideB] = useState({ mantenimiento: null, puertas: null, emergencia: false });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        const result = simularValoresDinamicos();

        const elevA = result.filter((item) => item.nombre_elevador === 'Elevador A');
        const elevB = result.filter((item) => item.nombre_elevador === 'Elevador B');
        
        setElevadorA(elevA);
        setElevadorB(elevB);
      } catch (err) {
        setError("Error executing SQL query: " + err.message);
      }
    };

    const cargaInicial = async () => {
      const startTime = Date.now();
      await fetchDatabaseData();
      
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(1500 - elapsed, 0);
      await delay(remainingTime);
      setLoading(false);
    };

    cargaInicial();

    const intervalId = setInterval(() => {
      fetchDatabaseData();
    }, 3000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [overrideA, overrideB]); // Re-dependemos de los overrides para inyectarlos en la simulación

  // Simulación del backend enviando datos, respetando si el usuario presionó un botón
  const simularValoresDinamicos = () => {
    const pisos = [1, 2, 3, 4, 5, 6, 7];
    const estadosPuertas = ['cerradas', 'abiertas', 'abriendo', 'cerrando'];
    
    // Si hay emergencia, se queda en su piso y se detiene. Si no, simula movimiento.
    const pisoA = overrideA.emergencia ? elevadorA.find(v => v.nombre_variable === 'posicion_actual')?.valor_numerico || 1 : pisos[Math.floor(Math.random() * pisos.length)];
    const pisoB = overrideB.emergencia ? elevadorB.find(v => v.nombre_variable === 'posicion_actual')?.valor_numerico || 1 : pisos[Math.floor(Math.random() * pisos.length)];

    // Respetamos la orden manual de puertas, si existe
    const puertaA = overrideA.emergencia ? 'cerradas' : (overrideA.puertas !== null ? overrideA.puertas : estadosPuertas[Math.floor(Math.random() * estadosPuertas.length)]);
    const puertaB = overrideB.emergencia ? 'cerradas' : (overrideB.puertas !== null ? overrideB.puertas : estadosPuertas[Math.floor(Math.random() * estadosPuertas.length)]);

    // Respetamos la orden manual de mantenimiento
    const mantA = overrideA.mantenimiento !== null ? overrideA.mantenimiento : 0;
    const mantB = overrideB.mantenimiento !== null ? overrideB.mantenimiento : 0;

    return [
      { nombre_elevador: 'Elevador A', nombre_variable: 'posicion_actual', valor_numerico: pisoA, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador A', nombre_variable: 'estado_puertas', valor_texto: puertaA, valor_numerico: null, valor_booleano: null },
      { nombre_elevador: 'Elevador A', nombre_variable: 'tiempo_recorrido', valor_numerico: overrideA.emergencia ? 0 : 4.5, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador A', nombre_variable: 'modo_mantenimiento', valor_booleano: mantA, valor_texto: null, valor_numerico: null },
      
      { nombre_elevador: 'Elevador B', nombre_variable: 'posicion_actual', valor_numerico: pisoB, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador B', nombre_variable: 'estado_puertas', valor_texto: puertaB, valor_numerico: null, valor_booleano: null },
      { nombre_elevador: 'Elevador B', nombre_variable: 'tiempo_recorrido', valor_numerico: overrideB.emergencia ? 0 : 3.2, valor_texto: null, valor_booleano: null },
      { nombre_elevador: 'Elevador B', nombre_variable: 'modo_mantenimiento', valor_booleano: mantB, valor_texto: null, valor_numerico: null }
    ];
  };

  // Función para enviar comandos UPDATE al "backend"
  const sendCommand = (elevadorId, accion, variable, nuevoValorTexto, nuevoValorBool) => {
    // 1. Mostramos el SQL que se ejecutaría para el profesor
    const sqlQuery = `UPDATE lecturas_plc \nSET valor_texto = ${nuevoValorTexto ? `'${nuevoValorTexto}'` : 'NULL'}, valor_booleano = ${nuevoValorBool !== null ? nuevoValorBool : 'NULL'} \nWHERE id_elevador = ${elevadorId} AND id_variable = (SELECT id_variable FROM variables_plc WHERE nombre_variable = '${variable}');`;
    
    alert(`Comando SCADA Enviado (Operación UPDATE):\n\n${sqlQuery}`);

    // 2. Aplicamos el override a la UI para que el usuario vea el cambio instantáneo
    if (elevadorId === 1) {
      if (accion === 'mantenimiento') setOverrideA({ ...overrideA, mantenimiento: nuevoValorBool });
      if (accion === 'puertas') setOverrideA({ ...overrideA, puertas: nuevoValorTexto });
      if (accion === 'emergencia') setOverrideA({ ...overrideA, emergencia: nuevoValorBool, puertas: 'cerradas' });
    } else {
      if (accion === 'mantenimiento') setOverrideB({ ...overrideB, mantenimiento: nuevoValorBool });
      if (accion === 'puertas') setOverrideB({ ...overrideB, puertas: nuevoValorTexto });
      if (accion === 'emergencia') setOverrideB({ ...overrideB, emergencia: nuevoValorBool, puertas: 'cerradas' });
    }
  };

  const getVariableValue = (dataArray, variableName) => {
    const variable = dataArray.find((v) => v.nombre_variable === variableName);
    if (!variable) return "N/A";
    
    if (variable.valor_texto !== null) {
      const textVal = variable.valor_texto.toLowerCase();
      if (textVal === 'cerradas') return "Closed";
      if (textVal === 'abiertas') return "Open";
      if (textVal === 'abriendo') return "Opening...";
      if (textVal === 'cerrando') return "Closing...";
      return textVal.charAt(0).toUpperCase() + textVal.slice(1);
    }
    if (variable.valor_numerico !== null) return variable.valor_numerico;
    if (variable.valor_booleano !== null) return variable.valor_booleano === 1 ? "Active" : "Inactive";
    return "N/A";
  };

  const DashboardCard = ({ title, value, unit, type, Icon, isEmergency }) => {
    let statusClass = "";
    
    if (isEmergency) {
      statusClass = "card-alert"; // Todo en rojo si hay emergencia
    } else {
      if (type === "mantenimiento") statusClass = value === "Active" ? "card-alert" : "card-safe";
      else if (type === "puertas") statusClass = (value === "Open" || value === "Opening..." || value === "Closing...") ? "card-warning" : "card-safe";
    }

    return (
      <div className={`monitoring-card ${statusClass}`}>
        <h3>
          {Icon && <Icon size={22} color={isEmergency ? "#ff4d4f" : "#5bb7ff"} strokeWidth={2.5} />} 
          {title}
        </h3>
        <p>
          {isEmergency && type === "tiempo" ? "0.00" : value} {unit && <span className="unit">{unit}</span>}
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

  return (
    <>
      <Nav />
      <div className="monitoring-container">
        <div className="monitoring-header">
          <h1>Control Room</h1>
          <p>Real-Time SCADA Monitoring & Command</p>
        </div>

        <div className="monitoring-comparison-wrapper">
          
          {/* ===================== ELEVADOR A ===================== */}
          <div className="monitoring-column">
            <div className="monitoring-column-title">
              <span>Elevator A</span>
              <span className="status-indicator" style={overrideA.emergencia ? {color: '#ff4d4f', borderColor: '#ff4d4f', background: 'rgba(255,77,79,0.1)'} : {}}>
                {overrideA.emergencia ? "● E-STOP" : "● ONLINE"}
              </span>
            </div>
            
            <div className="monitoring-grid">
              <DashboardCard Icon={MapPin} title="Current Position" value={getVariableValue(elevadorA, 'posicion_actual')} unit="Floor" type="posicion" isEmergency={overrideA.emergencia} />
              <DashboardCard Icon={DoorOpen} title="Door Status" value={getVariableValue(elevadorA, 'estado_puertas')} type="puertas" isEmergency={overrideA.emergencia} />
              <DashboardCard Icon={Timer} title="Travel Time" value={getVariableValue(elevadorA, 'tiempo_recorrido')} unit="sec" type="tiempo" isEmergency={overrideA.emergencia} />
              <DashboardCard Icon={Wrench} title="Maintenance" value={getVariableValue(elevadorA, 'modo_mantenimiento')} type="mantenimiento" isEmergency={overrideA.emergencia} />
            </div>

            {/* Panel de Control Elevador A */}
            <div className="control-panel">
              <button className="control-btn btn-warning" onClick={() => sendCommand(1, 'mantenimiento', 'modo_mantenimiento', null, overrideA.mantenimiento === 1 ? 0 : 1)}>
                <Wrench size={18}/> {overrideA.mantenimiento === 1 ? "Exit Maint." : "Enter Maint."}
              </button>
              <button className="control-btn btn-action" onClick={() => sendCommand(1, 'puertas', 'estado_puertas', 'abiertas', null)}>
                <DoorOpen size={18}/> Force Open
              </button>
              <button className="control-btn btn-danger" onClick={() => sendCommand(1, 'emergencia', 'estado_operacion', 'detenido', !overrideA.emergencia)}>
                {overrideA.emergencia ? <Power size={18}/> : <AlertTriangle size={18}/>} 
                {overrideA.emergencia ? "Reset" : "E-Stop"}
              </button>
            </div>
          </div>

          {/* ===================== ELEVADOR B ===================== */}
          <div className="monitoring-column">
            <div className="monitoring-column-title">
              <span>Elevator B</span>
              <span className="status-indicator" style={overrideB.emergencia ? {color: '#ff4d4f', borderColor: '#ff4d4f', background: 'rgba(255,77,79,0.1)'} : {}}>
                {overrideB.emergencia ? "● E-STOP" : "● ONLINE"}
              </span>
            </div>
            
            <div className="monitoring-grid">
              <DashboardCard Icon={MapPin} title="Current Position" value={getVariableValue(elevadorB, 'posicion_actual')} unit="Floor" type="posicion" isEmergency={overrideB.emergencia} />
              <DashboardCard Icon={DoorOpen} title="Door Status" value={getVariableValue(elevadorB, 'estado_puertas')} type="puertas" isEmergency={overrideB.emergencia} />
              <DashboardCard Icon={Timer} title="Travel Time" value={getVariableValue(elevadorB, 'tiempo_recorrido')} unit="sec" type="tiempo" isEmergency={overrideB.emergencia} />
              <DashboardCard Icon={Wrench} title="Maintenance" value={getVariableValue(elevadorB, 'modo_mantenimiento')} type="mantenimiento" isEmergency={overrideB.emergencia} />
            </div>

            {/* Panel de Control Elevador B */}
            <div className="control-panel">
              <button className="control-btn btn-warning" onClick={() => sendCommand(2, 'mantenimiento', 'modo_mantenimiento', null, overrideB.mantenimiento === 1 ? 0 : 1)}>
                <Wrench size={18}/> {overrideB.mantenimiento === 1 ? "Exit Maint." : "Enter Maint."}
              </button>
              <button className="control-btn btn-action" onClick={() => sendCommand(2, 'puertas', 'estado_puertas', 'abiertas', null)}>
                <DoorOpen size={18}/> Force Open
              </button>
              <button className="control-btn btn-danger" onClick={() => sendCommand(2, 'emergencia', 'estado_operacion', 'detenido', !overrideB.emergencia)}>
                {overrideB.emergencia ? <Power size={18}/> : <AlertTriangle size={18}/>} 
                {overrideB.emergencia ? "Reset" : "E-Stop"}
              </button>
            </div>
          </div>

        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Monitoring;