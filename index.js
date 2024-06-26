const express = require("express"); //llamamos al servidor
const request = require("request");  // Añade esta línea
const app = express(); //inicializar el servidor
const port = 3000;

// Importar archivo .env
require('dotenv').config();
const apiKey = process.env.API_KEY;

// Importar Middlewares
const error404 = require("./middlewares/error404");
const morgan = require("./middlewares/morgan");

// Logger
app.use(morgan(':method :url :status :param[id] - :response-time ms :body'));

// Rutas importadas
// const filmsRoutes = require("./routes/films.routes");

app.use(express.json()); // Habilito recepción de JSON en servidor
app.use(express.urlencoded({ extended: true})); // Habilito recepción de formulario
app.use(express.static('public')) // Habilito carpeta public

// Configuración de vistas PUG - Motor de plantillas
app.set('view engine', 'pug');
app.set('views','./views');

// Rutas

app.get('/', function (req, res) {
    res.render('home');
  })

app.get('/film', (req, res) => {
    const title = req.query.title;
    console.log(title)
    console.log(apiKey)
    if (!title) {
        return res.redirect('/');
    }
    const url = `https://www.omdbapi.com/?t=${title}&apikey=${apiKey}`;
    request(url, (error, response, body) => {
        if (error) {
            console.error(error);
            return res.render('film', { film: null, error: 'Error retrieving data from OMDB API' });
        }
        const film = JSON.parse(body);
        console.log(film);
        if (film.Response === 'False') {
            res.render('film', { film: null, error: 'No se encontró la película.' });
        } else {
            res.render('film', { film, error: null });
        }
    });
  });

app.use(error404); // Middleware gestiona error 404

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});