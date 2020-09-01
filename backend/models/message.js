
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = Schema({
	     //Json con sus propiedades. El campo ID es automático

		text: String,
		viewed: String,
		created_at: String,
		emitter: { type: Schema.ObjectId, ref:'User' },
		receiver: { type: Schema.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Message', MessageSchema);