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

    // ---- LISTAR publicaciones ---- Recoge el Id del usuario identificado + find de todos los usuarios que sigo para devolverme todas sus publicaciones en Json

    function getPublications(req, res){ //Pagination
        let page = 1; //Recogemos el parámetro de la página por URL
        if(req.params.page){ //Si existe le asignamos otro valor con los sig params
            page = req.params.page;
        }

        let itemsPerPage = 5;

        Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => { // Buscar todos los follows que hacemos como usuario identificado. 
                                                                                        //con populated sustituimos el id de usuario por el objeto completo que hace referencia 
          if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

          let follows_clean = []; //Array para los follows

          follows.forEach((follow) => {  //Por cada interacción al array se crea un objeto follow
            follows_clean.push(follow.followed); //push para añadir el id de usuario que estoy siguiendo. No añado el id si no un objeto completo

          });
          
          Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            //Busca todos los objetos/publicaciones cuyo usuario esté dentro de la variable
                                    //$in busca las coincidencias
                                   //sort ordena las publicaciones de mayor a menor gracias al parámetro created_at
                                   //populate lleva el objeto del usuario y nos devuelve los datos concretos
            //ya tendría un listado paginado de las publicaciones de los usuarios que sigo                      

            if(err) return res.status(500).send({message: 'Error al devolver las publicaciones'});

            if(!publications)  return res.status(404).send({message: 'Publications Not Found'});

            return res.status(200).send({
                total_items: total, 
                pages: Math.ceil(total/itemsPerPage), //Devuelve un total de todas las páginas
                page: page, //Página actual
                publications
            })

          }); 
        });

    }

  // ---- Buscar publicaciones por id ----

    function getOnePublication(req, res){ 
        let publicationId = req.params.id; //Recogemos el id que nos llega por URL

        Publication.findById(publicationId, (err, publication) => { 
            if(err) return res.status(500).send({message: 'Error al devolver las publicaciones'});

            if(!publication) return res.status(404).send({message: 'Publications not found'});


            return res.status(200).send({publication});
        });
    }


    // --- BORRAR publicaciones ----


    function deletePublication(req,res){
        let publicationId = req.params.id;

        Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err => { //métodos propios de mongoose
                        //({'user': req.user.sub, '_id': publicationId}) -> Solo puede borrar publicaciones el usuario que las ha creado y esté identificado
            if(err) return res.status(500).send({message: 'Error al borrar'});

            if(!publicationRemoved) return res.status(404).send({message: 'No se ha podido borrar'});

            return res.status(200).send({message: 'Publicación eliminada'});

        });
    }


module.exports = {
    probando,
    savePublication,
    getPublications,
    getOnePublication,
    deletePublication
}