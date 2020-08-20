'use strict'
let bcrypt = require('bcrypt-nodejs'); //requerimos bcrypt para cifrar las contraseñas (token)

let User = require('../models/user'); //cargamos el modelo de usuario. los controladores en mayúsculas

function home(req, res){
    res.status(200).send({
        message: ''
    });
}

function pruebas(req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Acción de prueba con NodeJs'
    });
}

function saveUser(req, res){
    let params = req.body; //recoge parámetros de POST
    let user = new User(); //variable para crear nuevos usuarios

    if(params.name && params.surname && params.nick && params.nick && params.email && params.password){
        //si nos llegan todos estos parámetros, pasamos a setear los datos al objeto del usuario

        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = null;
        
        //$or es para que busque si se cumplen las condiciones que le describa
        User.find({ $or: [ //función para que no se puedan repetir usuarios (user ni email)
                            {email: user.email.toLowerCase()},
                            {nick: user.nick.toLowerCase()}
                            ]}).exec((err, users) => { // función de callback para resolver en ambos casos (true y false)
                                 if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

                                 if(users && users.lenght >= 1){ //Si el usuario es mayor que 1, devolvemos esto:
                                     return res.status(200).send({message: 'El usuario ya existe, prueba con otro'});

                                 }else{
                                     //Si el usuario no está repetido, entonces cifrará la contraseña y pasamos a la sig función


                                     bcrypt.hash(params.password, null, null, (err, hash) => { //hash es la contraseña generada y err el posible error
                                        user.password = hash;

                                        user.save((err, userStored) => { //función callback para guardar el usuario
                                             if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
                                             //con este return nos ahorramos tener que anidar más if

                                             if(userStored){
                                                res.status(200).send({user: userStored}); //para devolver el usuario en caso de que esté almacenado OK

                                             }else{ //en caso de que no exista ese User almacenado
                                                res.status(404).send({message: 'Usuario no registrado'});
                                             }
                                         });
                                     });
                                }
                            });
        


     //hacemos un else para el caso de que no nos lleguen todos o haya algún error
     }else{ //en caso de que todos los parámetros que pusimos en el primer IF no se cumplan
         res.status(200).send({
             message: '¡Es imprescindible que rellenes todos los campos!'
         });
    }

}

module.exports = {
    home,
    pruebas,
    saveUser
}