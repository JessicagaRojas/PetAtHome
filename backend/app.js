'use strict'
//En este fichero vamos a codear todo lo relacionado con express (bodyparser, rutas, etc)
//Este fichero lo cargaremos desde el index.js


var express = require('express');
var bodyParser = require('body-parser'); //convierte el body de las peticiones que nos lleguen por POST, etc, en objetos de JS
var app = express(); //instancia que llama al framework express

//----- RUTAS ----

var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');

//Cargar middlewares. métodos que se ejecutan antes de que la petición se ejecute.
// app.use(bodyParser.urlencoded({extended:false})); //Config obligatoria de body parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //convierte lo del body a Json


// configurar cabeceras http con peticiones predeterminadas del CORS
//Esto equivale a crear el middleware (es un middleware)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});

//----- ROUTES ----

app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

// --- EXPORT ----

module.exports = app;