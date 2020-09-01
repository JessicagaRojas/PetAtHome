'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

// Conexión Database
mongoose.Promise = global.Promise; //conexión con la bbdd
mongoose.connect('mongodb://localhost:27017/petathome', { useMongoClient: true})
		.then(() => {
			console.log("Conexión con la bbdd realizada :D");
		
			//llamamos al método listen de express para que escuche las peticiones http

			app.listen(port, () => {
				console.log("servidor arrancado en el puerto 3800 :D");
			});
		})
		.catch(err => console.log(err));