//En este fichero vamos a codear todo lo relacionado con express (bodyparser, rutas, etc)
//Este fichero lo cargaremos desde el index.js

'user strict'

let express = require('express');
let bodyParser = require('body-parser'); //convierte el body de las peticiones que nos lleguen por POST, etc, en objetos de JS
let app = express(); //instancia que llama al framework express

//-----Cargar rutas

//Cargar middlewares. métodos que se ejecutan antes de que la petición se ejecute.
app.use(bodyParser.urlencoded({extended:false})); //Config obligatoria de body parser
app.use(bodyParser.json()); //convierte lo del body a Json
//cors

//-----rutas


//-----exportar cada fichero

module.exports = app;