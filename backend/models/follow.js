//En este modelo/colección se guardarán los ID relacionados con los usuarios que siguen y seguidos

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowSchema = Schema({
	 //Json con sus propiedades. El campo ID es automático
	user: { type: Schema.ObjectId, ref:'User' },
	followed: { type: Schema.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Follow', FollowSchema);