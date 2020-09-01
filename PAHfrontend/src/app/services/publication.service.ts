import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'; //Para que funcione suscribe
import { GLOBAL } from './global';
import { Publication } from '../models/publication';

@Injectable()
export class PublicationService{
	public url: string; //URL de nuestro backend: "localhost:3800/api"

	constructor(private _http: HttpClient){
		this.url = GLOBAL.url;
	}

	   // ---- AÑADIR publicaciones


	addPublication(token, publication):Observable<any>{
		let params = JSON.stringify(publication); //Json convertido a string
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',token);
		//Petición por POST al backend + guardado de estos parámetros


	   return this._http.post(this.url+'publication', params, {headers: headers}); //Petición por POST al backend + guardado de estos parámetros
	}

	    //---- OBTENER publicaciones listada con paginator


	getPublications(token, page = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',token);
			//Petición por POST al backend + guardado de estos parámetros    


		return this._http.get(this.url+'publications/'+page, {headers: headers}); //Petición por GET al backend + guardado de estos parámetros
	}



	getPublicationsUser(token, user_id, page = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',token);

		return this._http.get(this.url+'publications-user/'+user_id+'/'+page, {headers: headers});
	}

    //---- BORRAR publicaciones ----


	deletePublication(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type','application/json')
									   .set('Authorization',token);
		      //Petición por POST al backend + guardado de estos parámetros    


		return this._http.delete(this.url + 'publication/' + id, {headers: headers}); //Petición por GET al backend + guardado de estos parámetros
	}
}