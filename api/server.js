require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: 5432,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/posts", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM posts");
  res.send(rows);
});

app.post("/api/posts", async (req, res) => {
  const { title, data, description } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO posts (title, data, description) VALUES ($1, $2, $3)",
    [title, data, description]
  );
  res.send(rows);
});
