'use strict'

let express = require('express');
let UserController = require('../controllers/UserController');
let middleware_auth = require('../middlewares/auth');

let multipart = require('connect-multiparty'); 
let md_upload = multipart({uploadDir: './uploads/users'}); //md = middleware


let api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', middleware_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', middleware_auth.ensureAuth, UserController.getUser);
api.get('/user/:page?', middleware_auth.ensureAuth, UserController.getUsers); //el interrogante en pages es por opcional
api.put('/update-user/:id', middleware_auth.ensureAuth, UserController.updateUser);
api.post('/update-image-user/:id', middleware_auth.ensureAuth, md_upload, UserController.uploadImage);




module.exports = api;