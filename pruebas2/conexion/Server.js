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

app.get("/health", (req, res) => {
  console.log("Entró a /health");
  res.status(200).send("ok");
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