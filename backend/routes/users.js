'use strict'

let express = require('express');
let UserController = require('../controllers/UserController');
let middleware_auth = require('../middlewares/auth');

let api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', middleware_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', middleware_auth.ensureAuth, UserController.getUser);
api.get('/user/:page?', middleware_auth.ensureAuth, UserController.getUsers); //el interrogante en pages es por opcional





module.exports = api;