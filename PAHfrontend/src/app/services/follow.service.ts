import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Para que funcione suscribe

import { User } from '../models/user';
import { Follow } from '../models/follow';


@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public url: string;

  constructor(private httpClient: HttpClient) {this.url = environment.url;}
   

  // --- Guardar follow en la bbdd ----

    addFollow(token, follow):Observable<any>{
      let params = JSON.stringify(follow);
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);

      return this.httpClient.post(this.url + 'follow', params, {headers: headers});

    }


 // ---- Borrar follow ----


    deleteFollow(token, id):Observable<any>{
      let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);

      return this.httpClient.delete(this.url + 'follow', id, {headers: headers});

    }




}
