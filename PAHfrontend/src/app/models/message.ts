export interface Message {
    text:string,
    viewed:string,
    created_at:string,
    emitter:string,
    receiver:string
   }



/*
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let MessageSchema = Schema ({
     //Json con sus propiedades. El campo ID es automático
     text: String,
     viewed: String,
     created_at: String,
     emitter: { type: Schema.ObjectId, ref:'User' },
     receiver: { type: Schema.ObjectId, ref:'User' }

});

module.exports = mongoose.model('Message', MessageSchema);
*/