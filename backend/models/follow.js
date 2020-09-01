//En este modelo/colección se guardarán los ID relacionados con los usuarios que siguen y seguidos
'user strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let FollowSchema = Schema({
     //Json con sus propiedades. El campo ID es automático
     user: { type: Schema.ObjectId, ref:'User' },
     followed: { type: Schema.ObjectId, ref:'User' }

});

module.exports = mongoose.model('Follow', FollowSchema);