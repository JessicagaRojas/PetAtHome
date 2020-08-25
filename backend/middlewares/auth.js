'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');
let secret = 'bootcampdelinfierno'; //variable para definir la clave secreta

let payload;



exports.ensureAuth = function(req, res, next){ //El middleware va a recibir una request, una respuesta y el método next para que siga ejecutando el siguiente método fuera del middleware
    if(!req.headers.authorization){ //si el auth no llega bien, devolvemos error 403
        return res.status(403).send({message: 'La petición no está llegando correctamente'});
    }

    let token = req.headers.authorization.replace(/['"]+/g, ''); //reemplazamos las comillas dobles o simples del string del token por nada

    try{ //método try/catch para decodificar el payload y poder "atrapar" las excepciones que puedan surgir
        payload = jwt.decode(token, secret); //decodificar el payload con token + secret

        if(payload.exp <= moment().unix()){ //Si el payload lleva una fecha de exp menor o igual a la fecha actual...
            return res.status(401).send({message: 'token expirado'});
        }
    }catch(ex){ //en el caso de que se capture una excepción...
        return res.status(404).send({message: 'token incorrecto'});

    }

    req.user = payload; //adjunta el payload a la request para tener siempre dentro de los controladores el objeto del user logeado

    next(); 

}