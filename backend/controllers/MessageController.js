'use strict'

let moment = require('moment');
let mongoosePaginate = require('mongoose-pagination');

let User = require('../models/user');
let Follow = require('../models/follow');
let Message = require('../models/message');


// ----Enviar mensajes entre usuarios ----

function saveMessage(req, res){
    let params = req.body;

    if(!params.text || !params.receiver) return res.status(200).send({message: 'Envía los datos necesarios'}); //si no existen alguna o ninguna de las opciones...

    let message = new Message();
    message.emitter = req.user.sub; //emitter es el usuario que está logeado
    message.receiver = params.receiver;
    message.text = params.text;

    message.created_at = moment().unix(); //Guarda las fechas de emisión con la librería moment, en formato unix

    message.save((err, messageStored) => { //Función de callback para guardarlo, en caso de que devuelva algún error...
        if(err) return res.status(500).send({message: 'Error en la petición'});
 
        if(!messageStored) return res.status(500).send({message: 'Error al enviar el mensaje'});

        return res.status(200).send({message: messageStored});
    });
}

  // ---Listar mensajes recibidos y paginados----

    function getReceivedMessages(req, res){
        let userId = req.user.sub; //Primero recogemos el id del usuario que está logeado

        var page = 1; //La página empieza por 1 por defecto
        if(req.params.page){ 
            page = req.params.page; //si nos llegan parámetros, actualizamos la info y lo igualamos a las páginas que sean
        }

        let itemsPerPage = 5; //Mensajes que se van a mostrar por página

        Message.find({receiver: userId}).populate('emitter').paginate(page, itemsPerPage, (err, messages, total) => { //populate del usuario que ha enviado el/los mensaje. El emitter
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



module.exports = {
    saveMessage,
    getReceivedMessages
}