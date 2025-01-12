/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Komalpreet Kaur Gill  Student ID: 112767223  Date: 13-01-2025
*  Vercel Link: https://web-422-plum.vercel.app/
*
********************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const MoviesDB = require('./modules/moviesDB.js');
dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Initialize the database connection
const db = new MoviesDB();

app.use(cors());
app.use(express.json());

// Test route to ensure the server is running
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

// POST /api/movies - Add a new movie
app.post("/api/movies", (req, res) => {
  const movieData = req.body;
  db.addNewMovie(movieData)
    .then((movie) => res.status(201).json(movie))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// GET /api/movies - Get movies with pagination and optional filtering by title
app.get("/api/movies", (req, res) => {
  const { page = 1, perPage = 5, title } = req.query;
  db.getAllMovies(parseInt(page), parseInt(perPage), title)
    .then((movies) => res.json(movies))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// GET /api/movies/:id - Get a single movie by its _id
app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  db.getMovieById(id)
    .then((movie) => {
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(movie);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// PUT /api/movies/:id - Update an existing movie by _id
app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieData = req.body;
  db.updateMovieById(movieData, id)
    .then((updatedMovie) => res.json(updatedMovie))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// DELETE /api/movies/:id - Delete a movie by _id
app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  db.deleteMovieById(id)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Initialize the database connection and start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`server listening on: ${HTTP_PORT}`);
  });
}).catch((err) => {
  console.log(err);
});
