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

   // ---- AÑADIR publicaciones

   addNewPublication(token, publication):Observable<any>{
     let params = JSON.stringify(publication); //Json convertido a string
     let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                    .set('Authorization', token);
      //Petición por POST al backend + guardado de estos parámetros
      return this.httpClient.post(this.url + 'publication', params, { headers: headers }); //Petición por POST al backend + guardado de estos parámetros
    }

    //---- OBTENER publicaciones listada con paginator

    getPublications(token, page = 1):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);
      //Petición por POST al backend + guardado de estos parámetros    

      return this.httpClient.get(this.url + 'publications/' + page, { headers: headers }); //Petición por GET al backend + guardado de estos parámetros

    }

    //---- BORRAR publicaciones ----
    

    deletePublication(token, id):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
      //Petición por POST al backend + guardado de estos parámetros    

      return this.httpClient.delete(this.url + 'publications/' + id, { headers: headers }); //Petición por GET al backend + guardado de estos parámetros
    }

}
