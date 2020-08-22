'use strict'

let express = require('express');
let FollowController = require('../controllers/FollowController');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');

api.get('/pruebas-follow', middleware_auth.ensureAuth, FollowController.prueba);

module.exports = api;