'use strict'

let express = require('express');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');
let multipart = require('connect-multiparty'); //Para subir ficheros
let md_upload = multipart({ uploadDir: './uploads/users' }); //md = middleware

let PublicationController = require('../controllers/PublicationController');

// ---- RUTAS ----

api.get('/probando-pub', middleware_auth.ensureAuth, PublicationController.probando);
api.post('/publication', middleware_auth.ensureAuth, PublicationController.savePublication);
api.get('/publications/:page?', middleware_auth.ensureAuth, PublicationController.getPublications);
api.get('/publication/:id', middleware_auth.ensureAuth, PublicationController.getOnePublication);
api.delete('/publication/:id', middleware_auth.ensureAuth, PublicationController.deletePublication);
api.post('upload-image-publications/:id', [middleware_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-publications/:imageFile', middleware_auth.ensureAuth, PublicationController.getImageFile);

module.exports = api;