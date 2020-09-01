'use strict'


var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');


    //  ---- SEGUIR A OTRO -----

function postFollow(req, res){
	var params = req.body;

	var follow = new Follow();
	follow.user = req.user.sub; //guarda el ID del usuario identificado. el que sigue
	follow.followed = params.followed; //El usuario seguido es el que pasamos por POST

	follow.save((err, followStored) => { //para guardar el seguimiento
		if(err) return res.status(500).send({message: 'Error al guardar el seguimiento'});

		if(!followStored) return res.status(404).send({message: 'El seguimiento no se ha guardado'});

		return res.status(200).send({follow:followStored});
	});

}

    //  ---- BORRAR FOLLOW -----


function deleteFollow(req, res){
	var userId = req.user.sub; //Recoger al usuario que está logeado
	var followId = req.params.id; //Usuario al que dejamos de seguir

	Follow.find({'user':userId, 'followed':followId}).remove(err => { //Pasar Id's de ambos usuarios por URL
		if(err) return res.status(500).send({message: 'Error al dejar de seguir'});

		return res.status(200).send({message: 'El follow se ha eliminado!!'});
	});
}


    //  ---- LISTAR USUARIOS SEGUIDOS. PAGINATION -----



function getFollowingUsers(req, res){
	var userId = req.user.sub; //lo primero es identificar al usuario

	if(req.params.id && req.params.page){ //comprobar que nos llega un ID de usuario logeado por URL y un número de páginas
		userId = req.params.id;
	}

	var page = 1; //crear variable por defecto 1
	
	if(req.params.page){ //Si nos llega página por URL...
		page = req.params.page; //Si nos llega, actualizamos el valor por defecto

	}else{ //Si no existen páginas
		page = req.params.id;
	}

	var itemsPerPage = 6;


	Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => { //Para buscar todos los follows a los que sigue el user logeado
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!follows) return res.status(404).send({message: 'No estas siguiendo a ningun usuario'});

		followUserIds(req.user.sub).then((value) => {
			return res.status(200).send({ //en el caso de que todo vaya bien, devolvemos...
				total: total,
				pages: Math.ceil(total/itemsPerPage), //Calcula el total de páginas
				follows, //Esto crea la propiedad con toda la info dentro
				users_following: value.following,
				users_follow_me: value.followed,
			});
		});
	});
}

async function followUserIds(user_id){
	var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec((err, follows) => {
		return follows;
	});

	var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec((err, follows) => {
		return follows;
	});

	// Procesar following ids
	var following_clean = [];

	following.forEach((follow) => {
		following_clean.push(follow.followed);
	});
	
	// Procesar followed ids
	var followed_clean = [];

	followed.forEach((follow) => {
		followed_clean.push(follow.user);
	});
	
	return {
		following: following_clean,
		followed: followed_clean
	}
}

    //  ---- LISTAR USUARIOS QUE NOS SIGUEN. PAGINATION -----


function getFollowedUsers(req, res){ //lo primero es identificar al usuario 
	var userId = req.user.sub;

	if(req.params.id && req.params.page){ //comprobar que nos llega un ID de usuario logeado por URL y un número de páginas
		userId = req.params.id;
	}

	var page = 1; //crear variable por defecto 1
	
	if(req.params.page){ //Si nos llega página por URL...
		page = req.params.page; //Si nos llega, actualizamos el valor por defecto


	}else{ //Si no existen páginas
		page = req.params.id;
	}

	var itemsPerPage = 6;

	Follow.find({followed:userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => { //Para buscar todos los usuarios que siguen al user registrado
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});

		followUserIds(req.user.sub).then((value) => {
			return res.status(200).send({ //en el caso de que todo vaya bien, devolvemos...
				total: total,
				pages: Math.ceil(total/itemsPerPage), //Calcula el total de páginas
				follows, //Esto crea la propiedad con toda la info dentro
				users_following: value.following,
				users_follow_me: value.followed,
			});
		});
	});
}

            //  ---- DEVOLVER LISTADO MYFOLLOWS -----


function getMyFollows(req, res){
	var userId = req.user.sub;

	var find = Follow.find({user: userId});
	
	if(req.params.followed){
		find = Follow.find({followed: userId});
	}

	find.populate('user followed').exec((err, follows) => {
		if(err) return res.status(500).send({message: 'Error en el servidor'});

		if(!follows) return res.status(404).send({message: 'No sigues ningun usuario'});

		return res.status(200).send({follows});
	});
}



module.exports = {
	postFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers,
	getMyFollows
}