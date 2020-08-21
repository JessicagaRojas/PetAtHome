'use strict'

let express = require('express');
let UserController = require('../controllers/UserController');
let api = express.Router();

api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);



module.exports = api;