'use strict'
let bcrypt = require('bcrypt-nodejs'); //requerimos bcrypt para cifrar las contraseñas (token)

let User = require('../models/user'); //cargamos el modelo de usuario. los controladores en mayúsculas
let jwt = require('../services/token'); //cargamos el fichero del token

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

    //   ------ REGISTRO   ------


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
        


     //hacemos un else para el caso de que no nos lleguen todos los parámetros o haya algún error
     }else{ //en caso de que todos los parámetros que pusimos en el primer IF no se cumplan
         res.status(200).send({
             message: '¡Es imprescindible que rellenes todos los campos!'
         });
    }
}

 //   ------ LOGIN   ------

 function loginUser(req, res){
     let params = req.body; //primero una variable para recoger los datos de POSTMAN
     let email = params.email;
     let password = params.password;

     User.findOne({email: email},(err, user) => { //método para buscar una coincidencia en usuarios + emails
          if(err) return res.status(500).send({message: 'Error'});

          if(user){ //comparar la password con bcrypt
              bcrypt.compare(password, user.password, (err, check) => {
                if(check){ //si check es correcto, devolvemos los datos del usuario

                    if(params.gettoken){ //devolver token encriptado en caso de true

                        return res.status(200).send({
                            token: jwt.createToken(user) //le paso el objeto usuario
                        });

                    }else{
                        user.password = undefined; //ocultar la password que nos devuelve POSTMAN
                        return res.status(200).send({user});

                    }




                }else{ //si el check no encuentra 
                    return res.status(404).send({message: 'El usuario no se encuentra'});
                }
              });
          }else{
            return res.status(404).send({message: 'El usuario no se ha podido identificar'});

          }
     });
 }


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}