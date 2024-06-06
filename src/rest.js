const express = require('express');
const {authService, movieService, metadata} = require('./grpc-client.js');
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

// Auth middleware
app.use((req, res, next) => {
  metadata.remove('authorization');
  if (req.cookies.token) metadata.set('authorization', req.cookies.token);
  next()
})

function seeV1(req, res) {
  res.send(`
  <ul>
  <li>See <a href="/api/v1">/api/v1</a></li>
  </ul>
  `);
}
app.get('/', seeV1)
app.get('/api', seeV1)

app.get('/api/v1', (req, res) => {
  res.send(`
  <ul>
  <li>GET /api/v1/login</li>
  <li>GET /api/v1/logout</li>
  <li>GET /api/v1/movies</li>
  <li>POST /api/v1/movies/filter</li>
  <li>GET /api/v1/movie/:id</li>
  <li>POST /api/v1/movie</li>
  <li>PUT /api/v1/movie/:id</li>
  <li>DELETE /api/v1/movie/:id</li>
  </ul>
  `);
});


// Login
app.get('/api/v1/login', (req, res) => {
  authService.Auth({}, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.send(error.message ?? "Неизвестная ошибка");
    }
    else {
      if (response.token) {
        res.cookie('token', response.token);
        res.send(`Успешная авторизация: ${response.token}`);
        return;
      }
      res.send(error.message ?? "Неизвестная ошибка");
    }
  });
});

// Logout
app.get('/api/v1/logout', (req, res) => {
  metadata.remove('authorization');
  res.send(`Ок`);
});

// CreateMovie
app.post('/api/v1/movie', (req, res) => {
  movieService.CreateMovie(req.body, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.send(error.message ?? "Неизвестная ошибка");
    }
    else {
      res.json(response);
    }
  });
});

// GetMovie
app.get('/api/v1/movie/:id', (req, res) => {
  movieService.GetMovie({id: req.params.id}, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.status(404).send(error.message ?? "Неизвестная ошибка");
    }
    else {
      res.json(response);
    }
  });
});

// GetAllMovies
app.get('/api/v1/movies', (req, res) => {
  movieService.GetAllMovies({}, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error.message ?? "Неизвестная ошибка");
    }
    else {
      res.json(response);
    }
  });
});

// GetAllMovies with filter
app.post('/api/v1/movies/filter', (req, res) => {
  movieService.GetAllMovies(req.body, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send(error.message ?? "Неизвестная ошибка");
    }
    else {
      res.json(response);
    }
  });
});

// UpdateMovie
app.put('/api/v1/movie/:id', (req, res) => {
  movieService.UpdateMovie({id: req.params.id, ...req.body}, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.send(error.message ?? "Неизвестная ошибка");
    }
    else {
      res.json(response);
    }
  });
});

// DeleteMovie
app.delete('/api/v1/movie/:id', (req, res) => {
  movieService.DeleteMovie({id: req.params.id}, metadata, (error, response) => {
    if (error) {
      console.error(error);
      res.status(404).send(error.message ?? "Неизвестная ошибка");
    }
    else {
      res.json(response);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
