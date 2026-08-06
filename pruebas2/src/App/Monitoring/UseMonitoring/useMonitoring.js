import { useState, useEffect } from 'react';

const useMonitoring = () => {
  const [elevadorA, setElevadorA] = useState([]);
  const [elevadorB, setElevadorB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "" });
  const [overrideA, setOverrideA] = useState({ mantenimiento: null, puertas: null, emergencia: false });
  const [overrideB, setOverrideB] = useState({ mantenimiento: null, puertas: null, emergencia: false });

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        // Petición GET real para obtener los datos de la base de datos en lugar de simularlos.
        // NOTA: Asegúrate de tener esta ruta configurada en tu backend para devolver el SELECT.
        const response = await fetch('https://proyecto-integrador-nuevo-production.up.railway.app/api/lecturas');
        
        if (!response.ok) {
          throw new Error(`Error al obtener datos: Status ${response.status}`);
        }

        const result = await response.json();
        
        setElevadorA(result.filter((item) => item.nombre_elevador === 'Elevador A'));
        setElevadorB(result.filter((item) => item.nombre_elevador === 'Elevador B'));
      } catch (err) {
        setError("Error de conexión GET: " + err.message);
      }
    };

    const cargaInicial = async () => {
      const startTime = Date.now();
      await fetchDatabaseData();
      const elapsed = Date.now() - startTime;
      await delay(Math.max(1500 - elapsed, 0));
      setLoading(false);
    };

    cargaInicial();
    const intervalId = setInterval(() => fetchDatabaseData(), 3000);
    return () => clearInterval(intervalId);
  }, [overrideA, overrideB]);

  const sendCommand = async (elevadorId, accion, variable, nuevoValorTexto, nuevoValorBool) => {
    const elevadorName = elevadorId === 1 ? "A" : "B";
    let alertTitle = "Command Executed";
    let alertMessage = "";

    if (accion === 'mantenimiento') {
      alertMessage = nuevoValorBool === 1
        ? `Elevator ${elevadorName} has safely entered Maintenance Mode.`
        : `Elevator ${elevadorName} has exited Maintenance Mode and is back online.`;
    } else if (accion === 'puertas') {
      alertMessage = `Elevator ${elevadorName} doors have been forced OPEN.`;
    } else if (accion === 'emergencia') {
      alertTitle = nuevoValorBool ? "Emergency Alert" : "System Reset";
      alertMessage = nuevoValorBool
        ? `EMERGENCY STOP activated for Elevator ${elevadorName}. System halted.`
        : `Emergency lock disabled. Elevator ${elevadorName} is returning to normal operations.`;
    }

    setModal({ isOpen: true, title: alertTitle, message: alertMessage });

    const sqlQuery = `UPDATE lecturas_plc \nSET valor_texto = ${nuevoValorTexto ? `'${nuevoValorTexto}'` : 'NULL'}, valor_booleano = ${nuevoValorBool !== null ? nuevoValorBool : 'NULL'} \nWHERE id_elevador = ${elevadorId} \nAND id_variable = (SELECT id_variable FROM variables_plc WHERE nombre_variable = '${variable}');`;
    console.log(`%c[SQL UPDATE EXECUTED (Sent to API)]`, "color: #5bb7ff; font-weight: bold", `\n${sqlQuery}`);

    try {
      const response = await fetch('https://proyecto-integrador-nuevo-production.up.railway.app/api/monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elevadorId: elevadorId,
          variable: variable,
          valorTexto: nuevoValorTexto,
          valorBool: nuevoValorBool
        }),
      });

      if (!response.ok) {
        const serverError = await response.text();
        throw new Error(`Fallo en el servidor (Status ${response.status}): ${serverError}`);
      }

      if (elevadorId === 1) {
        if (accion === 'emergencia') setOverrideA({ ...overrideA, emergencia: nuevoValorBool, puertas: 'cerradas' });
        else setOverrideA({ ...overrideA, [accion]: accion === 'mantenimiento' ? nuevoValorBool : nuevoValorTexto });
      } else {
        if (accion === 'emergencia') setOverrideB({ ...overrideB, emergencia: nuevoValorBool, puertas: 'cerradas' });
        else setOverrideB({ ...overrideB, [accion]: accion === 'mantenimiento' ? nuevoValorBool : nuevoValorTexto });
      }

    } catch (err) {
      console.error("Error capturado en fetch POST:", err);
      setError(err.message);
    }
  };

  const closeModal = () => setModal({ isOpen: false, title: "", message: "" });

  return { elevadorA, elevadorB, loading, error, modal, overrideA, overrideB, sendCommand, closeModal };
};

export default useMonitoring;