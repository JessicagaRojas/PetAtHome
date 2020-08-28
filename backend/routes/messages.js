'use strict'

let express = require('express');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');


let MessageController = require('../controllers/MessageController');


api.post('/message', middleware_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages', middleware_auth.ensureAuth, MessageController.getReceivedMessages);


module.exports = api;