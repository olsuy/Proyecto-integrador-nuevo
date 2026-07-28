import './System.css';
import React, { useEffect, useState } from "react";
import Nav from '../Nav/Nav'; // Tu barra de navegación intacta

const System = () => {
  // 1. Aquí van los estados (const [checks...], const [speedData...])
  const [checks, setChecks] = useState([]);
  const [speedData, setSpeedData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  // 2. AQUÍ VA LA PARTE DEL CONST QUE PREGUNTAS
  const obtenerDatos = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      
      const respuestaStatus = await fetch(`${baseUrl}/api/pingdom-status`);
      const datosStatus = await respuestaStatus.json();
      if (datosStatus && datosStatus.checks) setChecks(datosStatus.checks);

      const respuestaSpeed = await fetch(`${baseUrl}/api/pingdom-speed`);
      const datosSpeed = await respuestaSpeed.json();
      console.log("Datos de Pingdom Speed:", datosSpeed);
      
      if (datosSpeed) {
        setSpeedData({
          grade: 'A', 
          score: datosSpeed.summary?.performance?.grade || 100, 
          loadTime: datosSpeed.summary?.loadtime || 96, 
          pageSize: datosSpeed.summary?.bytes ? (datosSpeed.summary.bytes / 1024).toFixed(2) : 1.18, 
          requests: datosSpeed.summary?.requests || 2
        });
      }

      const ahora = new Date();
      setUltimaActualizacion(ahora.toLocaleTimeString());
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    } finally {
      setCargando(false);
    }
  };

  // 3. Aquí va el useEffect que llama a obtenerDatos()
  useEffect(() => {
    obtenerDatos();
    const intervalo = setInterval(() => obtenerDatos(), 60000);
    return () => clearInterval(intervalo);
  }, []);

  // 4. Aquí va el return con todo el diseño HTML/JSX (Nav, tarjetas, etc.)
  return (
    <>
      <Nav />
      {/* ... todo el resto de tu diseño de las tarjetas ... */}
    </>
  );
};

export default System;