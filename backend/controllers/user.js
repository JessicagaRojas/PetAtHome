'use strict'


var bcrypt = require('bcrypt-nodejs'); //requerimos bcrypt para cifrar las contraseñas (token)
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs'); //librería "file system" de Node para trabajar con archivos (imágenes)
var path = require('path'); //librería para trabajar con rutas del sistema de ficheros


// --- MODELOS ---

var User = require('../models/user'); //cargamos el modelo de usuario. los controladores en mayúsculas
var Follow = require('../models/follow');
var Publication = require('../models/publication');
var jwt = require('../services/jwt'); //cargamos el fichero del token



    //   ------ REGISTRO   ------


function postUser(req, res){
	var params = req.body; //recoge parámetros de POST
	var user = new User(); //variable para crear nuevos usuarios

	if(params.name && params.surname && 
	   params.nick && params.email && params.password){ //si nos llegan todos estos parámetros, pasamos a setear los datos al objeto del usuario



		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;


		//$or es para que busque si se cumplen las condiciones que le describa
		// Controlar usuarios duplicados
		User.find({ $or: [ //función para que no se puedan repetir usuarios (user ni email)
				 {email: user.email.toLowerCase()},
				 {nick: user.nick.toLowerCase()}

		 ]}).exec((err, users) => { // función de callback para resolver en ambos casos (true y false)
		 	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

		 	if(users && users.length >= 1){ //Si el usuario es mayor que 1, devolvemos esto:
				 return res.status(200).send({message: 'El usuario ya existe, prueba con otro'});
				 

		 	}else{  //Si el usuario no está repetido, entonces cifrará la contraseña y pasamos a la sig función


				bcrypt.hash(params.password, null, null, (err, hash) => { //hash es la contraseña generada y err el posible error
					user.password = hash;

					user.save((err, userStored) => {
						if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
						 //con este return nos ahorramos tener que anidar más if

						if(userStored){ //para devolver el usuario en caso de que esté almacenado OK
							res.status(200).send({user: userStored});

						}else{ //en caso de que no exista ese User almacenado
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}

					});
				});

		 	}
		 });


	//hacemos un else para el caso de que no nos lleguen todos los parámetros o haya algún error
	}else{ //en caso de que todos los parámetros que pusimos en el primer IF no se cumplan
		res.status(200).send({
			message: 'Es imprescindible que rellenes todos los campos'
		});
	}
}


 //   ------ LOGIN   ------


function loginUser(req, res){
	var params = req.body; //primero una variable para recoger los datos de POSTMAN
	var email = params.email;
	var password = params.password;


	User.findOne({email: email}, (err, user) => { //método para buscar una coincidencia en usuarios + emails
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(user){ //comparar la password con bcrypt

			bcrypt.compare(password, user.password, (err, check) => {
				if(check){ //si check es correcto, devolvemos los datos del usuario
					
					if(params.gettoken){ //devolver token encriptado en caso de true

						return res.status(200).send({
							token: jwt.createToken(user) //le paso el objeto usuario
						});

					}else{ 
						//devolver datos de usuario
						user.password = undefined; //ocultar la password que nos devuelve POSTMAN
						return res.status(200).send({user});
					}
					
				}else{ //si el check no encuentra 
					return res.status(404).send({message: 'El usuario no se encuentra'});
				}
			});

		}else{
			return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
		}
	});
}

 // ---- BUSCAR USUARIOS Y SUS DATOS -----


function getUser(req, res){
	var userId = req.params.id; //recogemos el ID del usuario. "params" lo usamos para parámetros que nos llegan por URL
	// cuando nos llegan por POST o GET usamos "body"


	User.findById(userId, (err, user) => { //callback para la consulta a la bbdd
		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!user) return res.status(404).send({message: 'El usuario no existe'});

		followThisUser(req.user.sub, userId).then((value) => {
			user.password = undefined; //Para que no devuelva la password en el Json

			return res.status(200).send({
				user,
				following: value.following, 
				followed: value.followed
			});
		});

	});
}


  // ---- FUNCIÓN ASÍNCRONA para saber quién me sigue -----


async function followThisUser(identity_user_id, user_id){
	var following = await Follow.findOne({"user":identity_user_id, "followed":user_id}).exec((err, follow) => { //Para comprobar si seguimos a X usuario
			if(err) return handleError(err); 
			return follow; //Esta variable guarda dentro el resultado que devuelve el findone
		});


	var followed = await Follow.findOne({"user":user_id, "followed":identity_user_id}).exec((err, follow) => { //Para comprobar si seguimos a X usuario
			if(err) return handleError(err);  
			return follow; //Esta variable guarda dentro el resultado que devuelve el findOne. Al contrario que la anterior, ahora para saber si me sigue
		});

	return { //Devolvemos un Json
		following: following,
		followed: followed
	}
}

 //  ---- PAGINATION -----


function getUsers(req, res){ //Recibe por URL un número de página con los usuarios listados
	var identity_user_id = req.user.sub; //hace referencia al usuario logeado

	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}

	var itemsPerPage = 6; //Cuántos usuarios se van a mostrar por página

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		//el total es un contador que saca el total de registros aunque salgan solo x por página

		if(err) return res.status(500).send({message: 'Error en la petición'});

		if(!users) return res.status(404).send({message: 'Usuarios no encontrados'});

		followUserIds(identity_user_id).then((value) => {
			
			return res.status(200).send({
				users,
				users_following: value.following,
				users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)
			});
		
		});

	});	
}

  //  ---- DEVOLVER ARRAY's de usuarios seguidos y que nos siguen -----



async function followUserIds(user_id){
	var following = await Follow.find({"user":user_id}).select({'_id':0, '__v':0, 'user':0}).exec((err, follows) => {
		//En select se definen los campos que no queremos que lleguen, solo nos interesa el Id de usuario que estoy siguiendo como user logeado


		return follows;
	});

	var followed = await Follow.find({"followed":user_id}).select({'_id':0, '__v':0, 'followed':0}).exec((err, follows) => {
		//En select se definen los campos que no queremos que lleguen, solo nos interesa el Id de usuario que estoy siguiendo como user logeado

		return follows;
	});


    //PROCESAR FOLLOWING IDs

	var following_clean = [];

	following.forEach((follow) => {
		following_clean.push(follow.followed); //Obtener array limpio de Ids
	});
	

	//PROCESAR FOLLOWED IDs

	var followed_clean = [];

	followed.forEach((follow) => {
		followed_clean.push(follow.user); //Obtener array limpio de Ids
	});
	
	return {
		following: following_clean,
		followed: followed_clean
	}
}

   //  ---- CONTADOR DE USERS -----



function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId = req.params.id;
	}

	getCountFollow(userId).then((value) => {
		return res.status(200).send(value);
	});
}

async function getCountFollow(user_id){
	var following = await Follow.count({"user":user_id}).exec((err, count) => { //Si el usuario coincide ejectua la consulta y el contador
		if(err) return handleError(err);
		return count;
	});

	var followed = await Follow.count({"followed":user_id}).exec((err, count) => {
		if(err) return handleError(err);
		return count;
	});


    //variable para que me devuelva el total de publicaciones que hemos hecho

	var publications = await Publication.count({"user":user_id}).exec((err, count) => {
		if(err) return handleError(err);
		return count;
	});

	return {
		following: following,
		followed: followed,
		publications: publications
	}
}

  //  ---- ACTUALIZAR DATOS DE USUARIO -----


  function updateUser(req, res){
	var userId = req.params.id; //Recoge la ID de la URL
	var update = req.body; //recoge y sustituye los datos nuevos

	delete update.password; //objeto predeterminado. Borra la propiedad password


	if(userId != req.user.sub){ //si los datos del user no coinciden, no puede identificarse y por lo tanto no puede modificar
		return res.status(500).send({message: 'No tienes permiso para modificar datos'});
	}

	User.find({ $or: [
				 {email: update.email.toLowerCase()},
				 {nick: update.nick.toLowerCase()}
		 ]}).exec((err, users) => {
		 
		 	var user_isset = false;
		 	users.forEach((user) => {
		 		if(user && user._id != userId) user_isset = true;
		 	});

		 	if(user_isset) return res.status(404).send({message: 'Los datos ya están en uso'});
		 	
		 	User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({user: userUpdated});
			});

		 });

}


    //  ---- AVATAR DE USUARIO -----


	function uploadImage(req, res){
	var userId = req.params.id;

	if(req.files){ //si existe files (fichero) se puede subir
		var file_path = req.files.image.path;
		console.log(file_path);
		
		var file_split = file_path.split('\\');
		console.log(file_split);

		var file_name = file_split[2];
		console.log(file_name);

		var ext_split = file_name.split('\.');
		console.log(ext_split);

		var file_ext = ext_split[1]; //El 1 hace referencia a la extensión de la imagen subida
		console.log(file_ext);

		if(userId != req.user.sub){ //si los datos del user no coinciden, no puede identificarse y por lo tanto no puede subir foto en su perfil
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos');
			//llamamos a la función auxiliar definida al final del fichero para eliminar la imagen en caso de no coincidir extensión
		}


		//Si la imagen coincide con las extensiones que detallo abajo, se subirá
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
			 
			 // Actualizar documento de usuario logueado
			 User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) =>{
				if(err) return res.status(500).send({message: 'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

				return res.status(200).send({user: userUpdated}); //si todo va bien, devolvemos el objeto modificado
			 });

		}else{
			return removeFilesOfUploads(res, file_path, 'Extensión no válida'); //llamamos a la función auxiliar definida al final del fichero para eliminar la imagen en caso de no coincidir extensión
		}

	}else{
		return res.status(200).send({message: 'No se han subido imagenes'});
	}
}

function removeFilesOfUploads(res, file_path, message){
	fs.unlink(file_path, (err) => { //Para eliminar el fichero si es incorrecto
		return res.status(200).send({message: message}); 
	});
}

    //  ---- DEVOLVER IMÁGENES DE USUARIO -----


function getfiles(req, res){ //"buscar" "obtener" los avatares de los usuarios
	var image_file = req.params.imageFile; //recibe el método por URL
	var path_file = './uploads/users/'+image_file;

	fs.exists(path_file, (exists) => {
		if(exists){
			res.sendFile(path.resolve(path_file)); //devolver el fichero "en crudo"
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}

module.exports = {
	postUser,
	loginUser,
	getUser,
	getUsers,
	getCounters,
	updateUser,
	uploadImage,
	getfiles
}