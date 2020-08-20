'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PublicationSchema = Schema({
        //Json con sus propiedades. El campo ID es automático
    text: String,
    file: String,
    created_at: String,
    user: { type: Schema.ObjectId, ref: 'User' } //porque está relacionado con la tabla Users
});

module.exports = mongoose.model('Publication', PublicationSchema);