'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');



// ----ENVIAR MENSAJES ENTRE USUARIOS ----


function postMessage(req, res){
	var params = req.body;

	if(!params.text || !params.receiver) return res.status(200).send({message: 'Envia los datos necesarios'}); //si no existen alguna o ninguna de las opciones...

	var message = new Message();
	message.emitter = req.user.sub; //emitter es el usuario que está logeado
	message.receiver = params.receiver;
	message.text = params.text;
	message.created_at = moment().unix(); //Guarda las fechas de emisión con la librería moment, en formato unix
	message.viewed = 'false';

	message.save((err, messageStored) => { //Función de callback para guardarlo, en caso de que devuelva algún error...
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});

		return res.status(200).send({message: messageStored});
	});
}

  // ---Listar mensajes recibidos y paginados----


function getReceived(req, res){
	var userId = req.user.sub; //Primero recogemos el id del usuario que está logeado

	var page = 1; //La página empieza por 1 por defecto
	if(req.params.page){
		page = req.params.page; //si nos llegan parámetros, actualizamos la info y lo igualamos a las páginas que sean
	}

	var itemsPerPage = 6; //Mensajes que se van a mostrar por página

	Message.find({receiver: userId}).populate('emitter', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
		//populate del usuario que ha enviado el/los mensaje. El emitter. Además seleccionamos los parámatros que queremos que devuelva
		                    //receiver porque buscamos los mensajes que hemos recibido como usuario logeado

						
		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messages) return res.status(404).send({message: 'Messages not found'});

		return res.status(200).send({ //en el caso de que nos devuelva los mensajes OK, enviamos un objeto con total items, total páginas y los mensajes
			total: total,
			pages: Math.ceil(total/itemsPerPage), //Divido la cantidad de elementos por números de elementos por página, para obtener la mitad
			messages
		});
	});
}

      // ---Listar mensajes enviados----


function getEmmitted(req, res){
	var userId = req.user.sub; //Primero recogemos el id del usuario que está logeado

	var page = 1; //La página empieza por 1 por defecto
	if(req.params.page){
		page = req.params.page; //si nos llegan parámetros, actualizamos la info y lo igualamos a las páginas que sean
	}

	var itemsPerPage = 6; //Mensajes que se van a mostrar por página

	Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick _id').sort('-created_at').paginate(page, itemsPerPage, (err, messages, total) => {
		//populate del usuario que ha enviado el/los mensaje. El emitter. Además seleccionamos los parámatros que queremos que devuelva
		                    //emitter porque buscamos los mensajes que hemos enviado como usuario logeado

		if(err) return res.status(500).send({message: 'Error en la petición'});
		if(!messages) return res.status(404).send({message: 'Messages not found'});

		return res.status(200).send({ //en el caso de que nos devuelva los mensajes OK, enviamos un objeto con total items, total páginas y los mensajes
			total: total,
			pages: Math.ceil(total/itemsPerPage), //Divido la cantidad de elementos por números de elementos por página, para obtener la mitad
			messages
		});
	});
}

    // ----Obtener Mensajes NO LEIDOS ----


function getUnviewedMessages(req, res){
	var userId = req.user.sub; //Primero recogemos el userId logeado

	Message.count({receiver:userId, viewed:'false'}).exec((err, count) => { //Cuando el receiver sea el usuario y cuando viewed sea false, ejecutamos...
		if(err) return res.status(500).send({message: 'Error en la petición'});


		return res.status(200).send({ //Enviamos un objeto con el valor de count, para un contador de los mensajes no leídos 
			'unviewed': count
		});
	});
}

    // ---Marcar mensajes como leídos ---


function setMarkAsRead(req, res){
	var userId = req.user.sub;

	Message.update({receiver:userId, viewed:'false'}, {viewed:'true'}, {"multi":true}, (err, messagesUpdated) => {
		if(err) return res.status(500).send({message: 'Error en la petición'});
		return res.status(200).send({
			messages: messagesUpdated
		});
	});
}

module.exports = {
	postMessage,
	getReceived,
	getEmmitted,
	getUnviewedMessages,
	setMarkAsRead
};