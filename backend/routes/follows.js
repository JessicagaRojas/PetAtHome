'use strict'

let express = require('express');
let FollowController = require('../controllers/FollowController');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');

api.post('/follow', middleware_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', middleware_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', middleware_auth.ensureAuth, FollowController.getFollowingUsers);


module.exports = api;