'use strict'

let express = require('express');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');


let MessageController = require('../controllers/MessageController');


api.post('/message', middleware_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', middleware_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', middleware_auth.ensureAuth, MessageController.getEmmitedMessages);
api.get('/unread', middleware_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-unread', middleware_auth.ensureAuth, MessageController.setMarkAsRead);


module.exports = api;