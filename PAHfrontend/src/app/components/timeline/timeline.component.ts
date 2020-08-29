import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';


 
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public url: string;
  public identity;
  public token;
  public users: User[];
  public page;
  public pages;
  public total;

  public status: string;
  public publications: Publication[];

  constructor(    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService,
    private publicationService: PublicationService
    


  ) { 
    this.url = environment.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
    this.publication = this.publication;

   }

  ngOnInit(): void { this.getPublications(this.page); }


   // --- MOSTRAR listado publicaciones (scroll) ----

  getPublications(page){
    this.publicationService.getPublications(this.token, page).subscribe(
      response => {
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.publications = response.publications; //Dentro de esta propiedad está el array de publicaciones

          if(page > this.pages){ //Si la págiuna actual es mayor a la que tengo guardada...
            this._router.navigate(['/home']);  //...redirigimos a Home
          }

        }else{
          this.status = 'error';
        }
      },
      error => {
        let errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }

  onSubmit() {}

}
