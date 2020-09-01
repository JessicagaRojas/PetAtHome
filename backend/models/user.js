//Ponemos esto siempre al principio para utilizar los nuevos estándares de JS como E6

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema; //cargar y definir nuevos esquemas como objetos

var UserSchema = Schema({
	    //Json con sus propiedades

		name: String,
		surname: String,
		nick: String,
		email: String,
		password: String,
		role: String,
		image: String
});

module.exports = mongoose.model('User', UserSchema);
//User como nombre de identidad y Schema como formato/campos de cada modelo
//cada vez que guardemos un objeto en la bbdd se guardará en la colección pluralizado
//Por eso se crea en singular, porque lo usaremos como un objeto