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
        const querySQL = `
          SELECT e.nombre_elevador, v.nombre_variable, l.valor_texto, l.valor_numerico, l.valor_booleano, l.fecha_hora
          FROM lecturas_plc l
          INNER JOIN elevadores e ON l.id_elevador = e.id_elevador
          INNER JOIN variables_plc v ON l.id_variable = v.id_variable
          WHERE l.id_lectura IN (SELECT MAX(id_lectura) FROM lecturas_plc GROUP BY id_elevador, id_variable)
        `;
        console.log("Ejecutando Query Principal de Monitoreo (SELECT):", querySQL);

        const result = simularValoresDinamicos();
        setElevadorA(result.filter((item) => item.nombre_elevador === 'Elevador A'));
        setElevadorB(result.filter((item) => item.nombre_elevador === 'Elevador B'));
      } catch (err) {
        setError("Error executing SQL query: " + err.message);
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

  const simularValoresDinamicos = () => {
    const pisos = [1, 2, 3, 4, 5, 6, 7];
    const estadosPuertas = ['cerradas', 'abiertas', 'abriendo', 'cerrando'];

    const pisoA = overrideA.emergencia ? elevadorA.find(v => v.nombre_variable === 'posicion_actual')?.valor_numerico || 1 : pisos[Math.floor(Math.random() * pisos.length)];
    const pisoB = overrideB.emergencia ? elevadorB.find(v => v.nombre_variable === 'posicion_actual')?.valor_numerico || 1 : pisos[Math.floor(Math.random() * pisos.length)];
    const puertaA = overrideA.emergencia ? 'cerradas' : (overrideA.puertas !== null ? overrideA.puertas : estadosPuertas[Math.floor(Math.random() * estadosPuertas.length)]);
    const puertaB = overrideB.emergencia ? 'cerradas' : (overrideB.puertas !== null ? overrideB.puertas : estadosPuertas[Math.floor(Math.random() * estadosPuertas.length)]);
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
    console.log(`%c[SQL UPDATE EXECUTED]`, "color: #5bb7ff; font-weight: bold", `\n${sqlQuery}`);

    try {
      const response = await fetch('https://proyecto-integrador-nuevo-production.up.railway.app', {
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
        throw new Error('Error al actualizar la base de datos');
      }

      if (elevadorId === 1) {
        if (accion === 'emergencia') setOverrideA({ ...overrideA, emergencia: nuevoValorBool, puertas: 'cerradas' });
        else setOverrideA({ ...overrideA, [accion]: accion === 'mantenimiento' ? nuevoValorBool : nuevoValorTexto });
      } else {
        if (accion === 'emergencia') setOverrideB({ ...overrideB, emergencia: nuevoValorBool, puertas: 'cerradas' });
        else setOverrideB({ ...overrideB, [accion]: accion === 'mantenimiento' ? nuevoValorBool : nuevoValorTexto });
      }

    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => setModal({ isOpen: false, title: "", message: "" });

  return { elevadorA, elevadorB, loading, error, modal, overrideA, overrideB, sendCommand, closeModal };
};

export default useMonitoring;