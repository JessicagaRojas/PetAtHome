export interface User {
 name:string,
 surname:string,
 nick:string,
 email:string,
 password:string,
 role:string,
 image:string
}



/*
let mongoose = require('mongoose');
let Schema = mongoose.Schema; //cargar y definir nuevos esquemas como objetos
let UserSchema = Schema({
    //Json con sus propiedades
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});
*/