import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Para que funcione suscribe

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  public url: string; //URL de nuestro backend: "localhost:3800/api"
  public identity;
  public token;


  constructor(private httpClient: HttpClient) {
    this.url = environment.url;

  }

  //---- REGISTRO ----
  register(user: User): Observable<User> {
    let params = JSON.stringify(user); //Json convertido a string
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post<User>(this.url + 'register', params, { headers: headers }); //Petición por POST al backend + guardado de estos parámetros
  }

    // ---- LOGIN ----
  signup(user:User, gettoken = null): Observable<any>{ //Saca el token del usuario identificado contra el Api en cada de las peticiones
    if(gettoken != null){
    user.gettoken = gettoken;
    }

    let params = JSON.stringify(user); //convertir el usuario en string
    let headers = new HttpHeaders().set('Content-Type', 'application/json'); //Para definir las cabeceras

    return this._http.post(this.url+'login', params, {headers: headers});
  }

 // --- Sacar la info del usuario del localStorage, utilizando el servicio ----

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity')); //parseamos el string que devuelve a objeto Json dentro de la variable identity

    if(identity != "undefined"){
      this.identity = identity; //Definimos la variable dándole un valor
    }else{
      this.identity = null; //En el caso de que identity no devuelva nada, que sea null
    }

    return this.identity; //Para que nos devuelva el valor que tenga, sea null o no

  }

 // ---- Token ----

  getToken(){ //Conseguir el token guardado en Local Storage
    let token = localStorage.getItem('token'); //Obtener token

    if(token != "undefined"){ //Si el valor NO es undefined...
      this.token = token; // ...nos devuelve el token

    }else{
      this.token = null;
    }
    return this.token;
  }

}