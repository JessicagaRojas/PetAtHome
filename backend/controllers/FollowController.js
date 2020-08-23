'use strict'

let mongoosePaginate = require('mongoose-pagination');

//Cargamos los modelos

let User = require('../models/user');
let Follow = require('../models/follow');


    //  ---- SEGUIR A OTRO -----


function saveFollow(req, res){
    let params = req.body;

    let follow = new Follow();
    follow.user = req.user.sub; //guarda el ID del usuario identificado. el que sigue
    follow.followed = params.followed; //El usuario seguido es el que pasamos por POST

    follow.save((err, followStored) => { //para guardar el seguimiento
        if(err) return res.status(500).send({message: 'Error al guardar el follow'});

        if(!followStored) return res.status(404).send({message: 'Follow no guardado'});

        return res.status(200).send({follow:followStored});
            

    });
}


    //  ---- DEJAR DE SEGUIR -----


function deleteFollow(req, res){
    let userId = req.user.sub; //Recoger al usuario que está logeado
    let followId = req.params.id; //Usuario al que dejamos de seguir

    Follow.find({'user':userId, 'followed':followId}).remove(err => { //Pasar Id's de ambos usuarios por URL
      if(err) return res.status(500).send({message: 'Error al dejar de seguir'});

      return res.status(200).send({message:'Unfollow OK'});

    }); 


}


    //  ---- LISTAR USUARIOS SEGUIDOS. PAGINATION -----

    function getFollowingUsers(req, res){
        let userId = req.user.sub; //lo primero es identificar al usuario 

        if(req.params.id && req.params.page){ //comprobar que nos llega un ID de usuario logeado por URL y un número de páginas
            userId = req.params.id;
        }

        let page = 1; //crear variable por defecto 1

        if(req.params.page){ //Si nos llega página por URL...
            page = req.params.page; //Si nos llega, actualizamos el valor por defecto

        }else{ //Si no existen páginas
            page = req.params.id;

        }

        let itemsPerPage = 4;

        Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => { //Para buscar todos los follows a los que sigue el user logeado
            if(err) return res.status(500).send({message: 'Error en el servidor'});

            if(!follows) return res.status(404).send({message: 'No estás siguiendo a ningún usuario'});

            return res.status(200).send({ //en el caso de que todo vaya bien, devolvemos...
                total: total,
                pages: Math.ceil(total/itemsPerPage), //Calcula el total de páginas
                follows //Esto crea la propiedad con toda la info dentro
            });

        }); 

    }

    //  ---- LISTAR USUARIOS QUE NOS SIGUEN. PAGINATION -----

    function getFollowedUsers(req, res){
        let userId = req.user.sub; //lo primero es identificar al usuario 

        if(req.params.id && req.params.page){ //comprobar que nos llega un ID de usuario logeado por URL y un número de páginas
            userId = req.params.id;
        }

        let page = 1; //crear variable por defecto 1

        if(req.params.page){ //Si nos llega página por URL...
            page = req.params.page; //Si nos llega, actualizamos el valor por defecto

        }else{ //Si no existen páginas
            page = req.params.id;

        }

        let itemsPerPage = 4;

        Follow.find({followed:userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => { //Para buscar todos los usuarios que siguen al user registrado
            if(err) return res.status(500).send({message: 'Error en el servidor'});

            if(!follows) return res.status(404).send({message: 'Todavía no te sigue ningún usuario, ¿por qué no empiezas a seguir tú?'});

            return res.status(200).send({ //en el caso de que todo vaya bien, devolvemos...
                total: total,
                pages: Math.ceil(total/itemsPerPage), //Calcula el total de páginas
                follows //Esto crea la propiedad con toda la info dentro
            });

        }); 


    }





module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers
}