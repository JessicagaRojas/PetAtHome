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


  constructor(private httpClient: HttpClient) {
    this.url = environment.url;

  }

  register(user: User): Observable<User> {
    let params = JSON.stringify(user); //Json convertido a string
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post<User>(this.url + 'register', params, { headers: headers }); //Petición por POST al backend + guardado de estos parámetros
  }
}