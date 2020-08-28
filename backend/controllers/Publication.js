'use strict'

let path = require('path');
let fs = require('fs');
let moment = require('moment');
let mongoosePaginate = require('mongoose-pagination');

let Publication = require('../models/publication');
let User = require('../models/user');
let Follow = require('../models/follow');

function probando(req,res){
    res.status(200).send({
        message: "Hola desde el Publication Controller"
    });
}

 // ---- Guardar las publicaciones ----

function savePublication(req, res){ 
     let params = req.body; //Le pasamos las propiedades por body

    if(!params.text) return res.status(200).send({message: 'Debes enviar un texto'}); //En el caso de que no nos llegue un texto, 

    let publication = new Publication(); //parámetros a rellenar en cada objeto de publicación
    publication.text = params.text;
    publication.file = 'null';
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => { // Guardamos la publicación en la bbdd
        if(err) return res.status(500).send({message: 'Error al guardar'});

        if(!publicationStored) return res.status(500).send({message: 'La publicación no se ha guardado'});

        return res.status(200).send({publication: publicationStored}); //Si no recibimos errores, guardamos el objeto de la publicación
    });

}

module.exports = {
    probando,
    savePublication
}