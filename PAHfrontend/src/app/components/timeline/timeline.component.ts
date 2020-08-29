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
  public itemsPerPage;
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

  getPublications(page, adding = false){ //adding es para el "scroll"
    this.publicationService.getPublications(this.token, page).subscribe(
      response => {
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          //Añadir/concatenar los nuevos elementos que devuelve la API. Añadir al array principal más publicaciones


          if(!adding){ //Asignamos la respuesta del servicio por defecto a la propiedad this.publication
            this.publications = response.publications; //Dentro de esta propiedad está el array de publicaciones

          }else{ //En el caso de devolver true (cuando el UX le de al botón más)
            let arrayA = this.publications; //Aquí la primera page obtenida
            let arrayB = response.publications; //Aquí la nueva que se obtiene

            this.publications = arrayA.concat(arrayB); //Para que el contenido del array B se sume al A infinitamente

            $("html, body").animate({ scrollTop: $('body').prop("scrollHeight")}, 500); //Animacióhn de Jquery
          }


          if(page > this.pages){ //Si la págiuna actual es mayor a la que tengo guardada...
            //this._router.navigate(['/home']);  //...redirigimos a Home
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

  // ---- Lógica para el botón VER MÁS ----

  public noMore = false; //Condición para cuando no haya más publicaciones que mostrar. Por default en false
  viewmore(){
    if(this.publications.length == this.total){ //Si no hay más publicaciones, no se podrá cargar este botón
      this.noMore = true;

    }else{ //Si lo de arriba no se cumple y SÍ que tenemos más elementos por mostrar...
      this.page += 1;
    }

    this.getPublications(this.page, true);

  }

  onSubmit() {}

}
