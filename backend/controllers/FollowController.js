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





module.exports = {
    saveFollow,
    deleteFollow
}