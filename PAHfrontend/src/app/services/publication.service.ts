import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Para que funcione suscribe

import { Publication } from '../models/publication';


@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public url: string; //URL de nuestro backend: "localhost:3800/api"

  constructor(private httpClient: HttpClient) {
    this.url = environment.url;

   }

   addNewPublication(token, publication):Observable<any>{
     let params = JSON.stringify(publication); //Json convertido a string
     let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);
      //Petición por POST al backend + guardado de estos parámetros
      return this.httpClient.post(this.url + 'publication', params, { headers: headers }); //Petición por POST al backend + guardado de estos parámetros
    }
}
