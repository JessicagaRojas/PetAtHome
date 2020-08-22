'use strict'

let mongoosePaginate = require('mongoose-pagination');

//Cargamos los modelos

let User = require('../models/user');
let Follow = require('../models/follow');

function prueba(req, res){
    res.status(200).send({message: 'Hola mundo desde el controlador Follows'});


}


module.exports = {
    prueba
}