export interface Follow {
    user:string,
    followed: string
   }


   /*
   let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let FollowSchema = Schema({
     //Json con sus propiedades. El campo ID es automático
     user: { type: Schema.ObjectId, ref:'User' },
     followed: { type: Schema.ObjectId, ref:'User' }

});

module.exports = mongoose.model('Follow', FollowSchema);
*/