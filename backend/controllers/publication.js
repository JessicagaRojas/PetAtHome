'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');


 // ---- POSTEAR PUBLICACIONES ----


function postPublication(req, res){ //Le pasamos las propiedades por body
	var params = req.body;

	if(!params.text) return res.status(200).send({message: 'Debes enviar un texto!!'}); //En el caso de que no nos llegue un texto...

	var publication = new Publication(); //parámetros a rellenar en cada objeto de publicación
	publication.text = params.text;
	publication.file = 'null';
	publication.user = req.user.sub;
	publication.created_at = moment().unix();

	publication.save((err, publicationStored) => { // Guardamos la publicación en la bbdd
		if(err) return res.status(500).send({message: 'Error al guardar la publicación'});

		if(!publicationStored) return res.status(404).send({message: 'La publicación NO ha sido guardada'});

		return res.status(200).send({publication: publicationStored}); //Si no recibimos errores, guardamos el objeto de la publicación
	});

}

// ---- LISTAR publicaciones ----
 //Recoge el Id del usuario identificado + find de todos los usuarios que sigo para devolverme todas sus publicaciones en Json



function getPublications(req, res){ //Parámetros del Paginator
	var page = 1; //Recogemos el parámetro de la página por URL
	if(req.params.page){ //Si existe le asignamos otro valor con los sig params
		page = req.params.page;
	}

	var itemsPerPage = 6;

	Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
		// Buscar todos los follows que hacemos como usuario identificado. 
        //con populated sustituimos el id de usuario por el objeto completo que hace referencia 
		if(err) return res.status(500).send({message: 'Error devolver el seguimiento'});

		var follows_clean = []; //Array para los follows

		follows.forEach((follow) => { //Por cada interacción al array se crea un objeto follow
			follows_clean.push(follow.followed); //push para añadir el id de usuario que estoy siguiendo. No añado el id si no un objeto complet
		});
		follows_clean.push(req.user.sub); //Para mostrar también nuestras publicaciones propias


		Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
			if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

			if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

			return res.status(200).send({
				total_items: total,
				pages: Math.ceil(total/itemsPerPage),
				page: page,
				items_per_page: itemsPerPage,
				publications
			});
		});

	});
}


function getPublicationsUser(req, res){
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var user = req.user.sub;
	if(req.params.user){
		user = req.params.user;
	}

	var itemsPerPage = 6;

	Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
		                //Busca todos los objetos/publicaciones cuyo usuario esté dentro de la variable
                                    //$in busca las coincidencias
                                   //sort ordena las publicaciones de mayor a menor gracias al parámetro created_at
                                                       //populate lleva el objeto del usuario y nos devuelve los datos concretos
																		  //ya tendría un listado paginado de las publicaciones de los usuarios que sigo
																		  

		if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

		if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

		return res.status(200).send({
			total_items: total,
			pages: Math.ceil(total/itemsPerPage),
			page: page,
			items_per_page: itemsPerPage,
			publications
		});
	});

}

  // ---- BUSCAR publicaciones por id ----


function getOnePublication(req, res){
	var publicationId = req.params.id; //Recogemos el id que nos llega por URL

	Publication.findById(publicationId, (err, publication) => {
		if(err) return res.status(500).send({message: 'Error devolver publicaciones'});

		if(!publication) return res.status(404).send({message: 'No existe la publicación'});

		return res.status(200).send({publication});
	});
}

    // --- BORRAR publicaciones ----


function deletePublication(req, res){
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove(err => { //métodos propios de mongoose
		                                //({'user': req.user.sub, '_id': publicationId}) -> Solo puede borrar publicaciones el usuario que las ha creado y esté identificado

		if(err) return res.status(500).send({message: 'Error al borrar publicaciones'});
		
		return res.status(200).send({message: 'Publicación eliminada correctamente'});
	});
}


// ---- SUBIR Imágenes en las publicaciones ----


function uploadImage(req, res){
	var publicationId = req.params.id;

	if(req.files){ //si existe files (fichero) se puede subir
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1]; //El 1 hace referencia a la extensión de la imagen subida

		    //Si la imagen coincide con las extensiones que detallo abajo, se subirá

	
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			Publication.findOne({'user':req.user.sub, '_id':publicationId}).exec((err, publication) => { //Solo puede borrar imágenes el usuario logeado como el mismo que las ha publicado
				console.log(publication);
				if(publication){

					 // Actualizar documento de publicación
					 Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) =>{
						if(err) return res.status(500).send({message: 'Error en la petición'});

						if(!publicationUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

						return res.status(200).send({publication: publicationUpdated}); //si todo va bien, devolvemos el objeto modificado
					 });
				}else{
					return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar esta publicacion');
				}
			});
				 

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'}); //llamamos a la función auxiliar definida al final del fichero para eliminar la imagen en caso de no coincidir extensión
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => { //Para eliminar el fichero si es incorrecto
		return res.status(200).send({message: message});
	});
}

    //  ---- DEVOLVER IMÁGENES DE USUARIO -----


function getUserImage(req, res){ //"buscar" "obtener" los avatares de los usuarios
	var image_file = req.params.imageFile; //recibe el método por URL
	var path_file = './uploads/publications/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file)); //devolver el fichero "en crudo"
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	postPublication,
	getPublications,
	getPublicationsUser,
	getOnePublication,
	deletePublication,
	uploadImage,
	getUserImage
}