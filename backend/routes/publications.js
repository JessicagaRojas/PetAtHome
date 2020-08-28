'use strict'

let express = require('express');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');
let multipart = require('connect-multiparty'); //Para subir ficheros
let md_upload = multipart({ uploadDir: './uploads/users' }); //md = middleware

let PublicationController = require('../controllers/Publication');

// ---- RUTAS ----

api.get('/probando-pub', middleware_auth, PublicationController.probando);
api.post('/publication', middleware_auth, PublicationController, savePublication);







module.exports = api;