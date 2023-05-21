const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "post-it",
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow access to any domain
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Allow these headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  ); // Allow these methods
  next();
});

app.get("/api/posts", (req, res, next) => {
  pool.query("SELECT * FROM post", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching posts" });
    } else {
      const posts = result.rows;
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts,
      });
    }
  });
});

app.post("/api/posts", (req, res, next) => {
  const { title, date, content } = req.body;
  pool.query(
    "INSERT INTO post (title, date, description) VALUES ($1, $2, $3) RETURNING *",
    [title, date, content],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating post" + err });
      } else {
        const newPost = result.rows[0];
        res.status(201).json({
          message: "Post added successfully",
          post: newPost,
        });
      }
    }
  );
});

module.exports = app;
