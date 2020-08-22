'use strict'
//Este fichero es solo para el método token

let jwt = require('jwt-simple'); //requerir token
let moment = require('moment'); //librería para poner fechas

let secret = 'bootcampdelinfierno'; //variable para definir la clave secreta


exports.createToken = function(user){
    let payload = { //creo un objeto con los datos de usuario que quiero codificar
        sub: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,

        iat: moment().unix(), //fecha de creación del token. librería moment con codif unix
        exp: moment().add(30, 'days').unix //fecha de expiración en 30 días

    };

    return jwt.encode(payload, secret); //devolver el método payload + secreto

};