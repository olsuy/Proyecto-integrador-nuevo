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
  database: process.env.DB_NAME
});

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE correo = ? AND password_hash = ? AND estado = 'activo'",
      [email, password]
    );


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

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});