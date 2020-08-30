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
     console.log('REQQQQQ',req);
     console.log('PARAMMSSSS',params);
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

          follows_clean.push(req.user.sub); //Para mostrar también nuestras publicaciones propias
          
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
                items_per_page: items_per_page,
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

    // ---- Subir Imágenes en las publicaciones ----


        function uploadImage(req, res){
            var publicationId = req.params.id;
    
           if(req.files){ //si existe files (fichero) se puede subir
                let file_path = req.files.image.path;
                console.log(file_path);
                let file_split = file_path.split('\\');
    
                let file_name = file_split[2];
    
                let ext_split = file_name.split('\.');
                let file_ext = ext_split[1]; //El 1 hace referencia a la extensión de la imagen subida
    

    
                //Si la imagen coincide con las extensiones que detallo abajo, se subirá
                if(file_text == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg'){
    

                    Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication) => { //Solo puede borrar imágenes el usuario logeado como el mismo que las ha publicado
                        if(publication){
                            Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) => { //Actualizar el documento de la publicación con la imagen
    
                                if(err) return res.status(500).send({message: 'No tienes permiso para modificar datos'});
            
                                if(!publicationUpdated) return res.status(404).send({message: 'Error not found. No se ha podido actualizar'});
            
                                return res.status(200).send({publication: publicationUpdated}); //si todo va bien, devolvemos el objeto modificado
            
            
                            });
                        }else{
                            return removeFilesOfUploads(file_path, 'No tienes permiso'); //llamamos a la función auxiliar definida al final del fichero para eliminar la imagen en caso de no coincidir extensión

                        }

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
    
        function getImageFile(req, res){ //"buscar" "obtener" los avatares de los usuarios
            let image_file = req.params.imageFile; //recibe el método por URL
            let path_file = './uploads/publications/'+image_file;
    
            fs.exists(path_file, (exists) => { 
                if(exists){
                    res.sendFile(path.resolve(path_file)); //devolver el fichero "en crudo"
    
                }else{
                    res.status(200).send({message: 'La imagen no existe'});
                }
            });
        }


module.exports = {
    probando,
    savePublication,
    getPublications,
    getOnePublication,
    deletePublication,
    uploadImage,
    getImageFile
}