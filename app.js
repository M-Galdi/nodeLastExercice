const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Une erreur s'est produite" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }
    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }
    const token = jwt.sign({ email: user.email }, "process.env.JWT_SECRET");
    const date = new Date().toISOString();
    const logMessage = `${user.username} - ${date} - ${token}\n`;
    fs.appendFile("log.txt", logMessage, (err) => {
      if (err) {
        console.error(err);
      }
    });
    res.json({ token });
  });
});
