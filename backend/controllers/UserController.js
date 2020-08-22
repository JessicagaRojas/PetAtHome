'use strict'
let bcrypt = require('bcrypt-nodejs'); //requerimos bcrypt para cifrar las contraseñas (token)
let mongoosePaginate = require('mongoose-pagination');
let fs = require('fs'); //librería "file system" de Node para trabajar con archivos (imágenes)
let path = require('path'); //librería para trabajar con rutas del sistema de ficheros

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

 // ---- BUSCAR USUARIOS Y SUS DATOS -----

 function getUser(req, res){ 
     let userId = req.params.id; //recogemos el ID del usuario. "params" lo usamos para parámetros que nos llegan por URL
                                 // cuando nos llegan por POST o GET usamos "body"
    
    User.findById(userId, (err, user) => { //callback para la consulta a la bbdd
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!user) return res.status(404).send({message: 'El usuario no existe'});

        return res.status(200).send({user}); 

    });
 }

 //  ---- PAGINATION -----

  function getUsers(req, res){ //Recibe por URL un número de página con los usuarios listados
    let identity_user_id = req.user.sub; //hace referencia al usuario logeado

    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    let itemsPerPage = 5; //Cuántos usuarios se van a mostrar por página

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => { 
        //el total es un contador que saca el total de registros aunque salgan solo x por página

        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!users) return res.status(404).send({message: 'Usuarios no encontrados'});

        return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });

    });

  }

  //  ---- ACTUALIZAR DATOS DE USUARIO -----

  function updateUser(req, res){
      let userId = req.params.id; //Recoge la ID de la URL
      let update = req.body; //recoge y sustituye los datos nuevos
      
      delete update.password; //objeto predeterminado. Borra la propiedad password

      if(userId != req.user.sub){ //si los datos del user no coinciden, no puede identificarse y por lo tanto no puede modificar
          return res.status(500).send({message: 'No tienes permiso para modificar datos'});
     }

      User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdate) => { //si todo va bien

        if(err) return res.status(500).send({message: 'No tienes permiso para modificar datos'});

        if(!userUpdated) return res.status(404).send({message: 'Error not found. No se ha podido actualizar'});

        return res.status(200).send({user: userUpdated}); //si todo va bien, devolvemos el objeto modificado

      });

  }

    //  ---- AVATAR DE USUARIO -----

    function uploadImage(req, res){
        var userId = req.params.id;

       if(req.files){ //si existe files (fichero) se puede subir
            let file_path = req.files.image.path;
            console.log(file_path);
            let file_split = file_path.split('\\');

            let file_name = file_split[2];

            let ext_split = file_name.split('\.');
            let file_ext = ext_split[1]; //El 1 hace referencia a la extensión de la imagen subida

            if(userId != req.user.sub){ //si los datos del user no coinciden, no puede identificarse y por lo tanto no puede subir foto en su perfil
               return removeFilesOfUploads(file_path, 'No tienes permiso para actualizar los datos'); //llamamos a la función auxiliar definida al final del fichero para eliminar la imagen en caso de no coincidir extensión

            }

            //Si la imagen coincide con las extensiones que detallo abajo, se subirá
            if(file_text == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){

                User.findByIdAndUpdate(UserId, {image: file_name}, {new:true}, (err, userUpdated) => {

                    if(err) return res.status(500).send({message: 'No tienes permiso para modificar datos'});

                    if(!userUpdated) return res.status(404).send({message: 'Error not found. No se ha podido actualizar'});

                    return res.status(200).send({user: userUpdated}); //si todo va bien, devolvemos el objeto modificado


                });

            }else{
               return removeFilesOfUploads(file_path, 'Extensión no válida'); //llamamos a la función auxiliar definida al final del fichero para eliminar la imagen en caso de no coincidir extensión
            }

       }else{
           return res.status(200).send({message: 'No se ha podido subir la imagen'});
       }
    }

    function removeFilesOfUploads(res, file_path, message){
        fs.unlink(file_path, (err) => { //Para eliminar el fichero si es incorrecto
            return res.status(200).send({message: message});
        });
    }

    //  ---- DEVOLVER IMÁGENES DE USUARIO -----

    function getImageFile(req, res){
        let image_file = req.params.imageFile; //recibe el método por URL
        let path_file = './uploads/users/'+image_file;

        fs.exists(path_file, (exists) => {
            if(exists){
                res.sendFile(path.resolve(path_file)); //devolver el fichero "en crudo"
                
            }else{
                res.status(200).send({message: 'La imagen no existe'});
            }
        });
    }





module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}