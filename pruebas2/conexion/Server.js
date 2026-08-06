require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());
app.use(express.json());

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

(async () => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log(rows);
  } catch (err) {
    console.error('Error DB:', err);
  }
})();

app.get("/", (req, res) => {
  console.log("Entró a la raíz");
  res.status(200).send("Backend funcionando");
});

// En tu archivo de servidor backend (ej. server.js o index.js)

// ¡Esta ruta debe coincidir EXACTAMENTE con lo que pusiste en el fetch de React!
app.get("/api/lecturas", (req, res) => {
  console.log("Entró a /api/lecturas");

  const querySQL = `
    SELECT e.nombre_elevador, v.nombre_variable, l.valor_texto, l.valor_numerico, l.valor_booleano, l.fecha_hora
    FROM lecturas_plc l
    INNER JOIN elevadores e ON l.id_elevador = e.id_elevador
    INNER JOIN variables_plc v ON l.id_variable = v.id_variable
    WHERE l.id_lectura IN (SELECT MAX(id_lectura) FROM lecturas_plc GROUP BY id_elevador, id_variable)
  `;

  db.query(querySQL, (err, results) => {
    if (err) {
      console.error("Error en GET /api/lecturas:", err);
      return res.status(500).send("Error al consultar la base de datos");
    }
    res.status(200).json(results);
  });
});

app.post("/api/monitor", (req, res) => {
  console.log("Entró a /api/monitor con los datos:", req.body);

  const { elevadorId, variable, valorTexto, valorBool } = req.body;

  const sqlQuery = `
    UPDATE lecturas_plc 
    SET valor_texto = ?, valor_booleano = ? 
    WHERE id_elevador = ? 
    AND id_variable = (SELECT id_variable FROM variables_plc WHERE nombre_variable = ?)
  `;

  const values = [
    valorTexto !== undefined ? valorTexto : null, 
    valorBool !== undefined ? valorBool : null, 
    elevadorId, 
    variable
  ];

  db.query(sqlQuery, values, (err, results) => {
    if (err) {
      console.error("Error en POST /api/monitor:", err);
      return res.status(500).send("Error al actualizar la base de datos");
    }
    res.status(200).send("Comando ejecutado y base de datos actualizada");
  });
});

app.get("/health", (req, res) => {
  console.log("Entró a /health");
  res.status(200).send("ok");
});

// CONFIGURACION DE API PARA PINGDOM - RUTAS DEL BACKEND

// Ruta para obtener el estado general (Online/Offline)
app.get('/api/pingdom-status', async (req, res) => {
  try {
    const url = 'https://api.pingdom.com/api/3.1/checks';
    const opciones = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.PINGDOM_API_TOKEN}` }
    };
    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json();
    res.json(datos);
  } catch (error) {
    console.error('Error obteniendo datos de Pingdom:', error);
    res.status(500).json({ error: 'Error interno conectando con Pingdom' });
  }
});

app.get('/api/pingdom-uptime', async (req, res) => {
  try {
    const checkId = '14558878'; 
    // Obtenemos los datos de los últimos 7 días (ajustado en segundos Timestamp UNIX)
    const toDate = Math.floor(Date.now() / 1000);
    const fromDate = toDate - (7 * 24 * 60 * 60); 
    
    // API de resumen promedio (para % de uptime)
    const urlSummary = `https://api.pingdom.com/api/3.1/summary.average/${checkId}?includeuptime=true&from=${fromDate}&to=${toDate}`;
    // API de salidas y logs (para la tabla)
    const urlOutage = `https://api.pingdom.com/api/3.1/summary.outage/${checkId}?from=${fromDate}&to=${toDate}`;
    
    const opciones = {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${process.env.PINGDOM_API_TOKEN}` }
    };

    const [resSummary, resOutage] = await Promise.all([
      fetch(urlSummary, opciones),
      fetch(urlOutage, opciones)
    ]);

    const datosSummary = await resSummary.json();
    const datosOutage = await resOutage.json();

    res.json({
      summary: datosSummary,
      outages: datosOutage
    });
    
  } catch (error) {
    console.error('Error obteniendo datos de Uptime:', error);
    res.status(500).json({ error: 'Error interno conectando con Pingdom' });
  }
});

// Ruta para obtener la velocidad de la página (Page Speed)
app.get('/api/pingdom-speed', async (req, res) => {
  try {
    const checkId = '14558878'; 
    const url = `https://api.pingdom.com/api/3.1/summary.performance/${checkId}`;
    
    const opciones = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PINGDOM_API_TOKEN}`
      }
    };

    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json();
    
    res.json(datos);
    
  } catch (error) {
    console.error('Error obteniendo datos de velocidad de Pingdom:', error);
    res.status(500).json({ error: 'Error interno conectando con Pingdom' });
  }
});

app.post("/api/login", async (req, res) => {
  const start = Date.now();
  const { email, password } = req.body;

  try {
    const qStart = Date.now();

    const [rows] = await db.execute(
      "SELECT id_usuario, nombre, apellido_paterno, apellido_materno, correo, username, id_rol, estado FROM usuarios WHERE correo = ? AND password_hash = ? AND estado = 'activo'",
      [email, password]
    );

    console.log("Tiempo query:", Date.now() - qStart, "ms");
    console.log("Tiempo total login:", Date.now() - start, "ms");

    if (rows.length > 0) {
      res.json({ success: true, usuario: rows[0] });
    } else {
      res.json({ success: false, message: "Incorrect email or Password" });
    }
  } catch (error) {
    console.error("ERROR REAL DEL LOGIN:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});