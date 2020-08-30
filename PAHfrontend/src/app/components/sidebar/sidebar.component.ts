import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';


import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public url: string;
  public identity;
  public user: User; //Creamos el objeto de User para rellenar y modificarlo
  public token;
  public publication: Publication;
  public status;
  public stats;
  form: FormGroup;



  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    public userService: UserService,
    public publicationService: PublicationService,
    private formBuilder: FormBuilder

  ) {
    this.url = environment.url;
    this.identity = this.userService.getIdentity(); //Método para sacar el usuario logeado
    this.token = this.userService.getToken(); //Inicializamos la propiedad con el token almacenado en esta variable
    this.stats = this.userService.getStats(); // GetStats saca los diferentes valores de los usuarios para utilizar contadores (las estadísticas)


   }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      text: ['', Validators.required],
      file: ['', Validators.required],
      user: ['', Validators.required] //to do -> Se tiene que pasar el usuario
    });
  }

  onSubmit() {
    this.publicationService.addNewPublication(this.token, this.form.value).subscribe(
      response => { 
        if(response.publication){ //Si la respuesta llega correctamente...
         // this.publication = response.publication;
          this.status = 'succes';
          this.form.reset();
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


}
