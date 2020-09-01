'use strict'

let express = require('express');
let FollowController = require('../controllers/FollowController');
let api = express.Router();
let middleware_auth = require('../middlewares/auth');

api.post('/follow', middleware_auth.ensureAuth, FollowController.postFollow);
api.delete('/follow/:id', middleware_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?', middleware_auth.ensureAuth, FollowController.getFollowing);
api.get('/followed/:id?/:page?', middleware_auth.ensureAuth, FollowController.getFollowed);
api.get('/get-my-follows/:followed?', middleware_auth.ensureAuth, FollowController.getMyFollowsUsers);



module.exports = api;