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
  public stats;


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
  signup(user, gettoken = null): Observable<any>{ //Saca el token del usuario identificado contra el Api en cada de las peticiones
    if(gettoken != null){
    user.gettoken = gettoken;
    }

    let params = JSON.stringify(user); //convertir el usuario en string
    let headers = new HttpHeaders().set('Content-Type', 'application/json'); //Para definir las cabeceras

    return this.httpClient.post<User>(this.url + 'login', params, {headers: headers}); //Petición por POST al backend + guardado de estos parámetros
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
    return this.token
  }

  // ---- Obtener usuarios ----

  getUsers(page = null):Observable<any>{ //petición a la API del paginator. Traer lista de usuarios 
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                  .set('Authorization', this.getToken());

      return this.httpClient.get<User>(this.url + 'users/' + page, {headers: headers});
  }


  getUser(id):Observable<any>{ //petición a la API para sacar UN solo usuario (lo usamos en los perfiles)
    let headers = new HttpHeaders().set('Content-type', 'application/json')
                                  .set('Authorization', this.getToken());

      return this.httpClient.get<User>(this.url + 'user/' + id, {headers: headers});
  }

  // ---Estadísticas de usuario ---

  getStats(){
    let stats = JSON.parse(localStorage.getItem('stats'));
      if(stats != "undefined"){
        this.stats = stats;

      }else{
        this.stats = null;
      }
      return this.stats;
    
    
  }



}