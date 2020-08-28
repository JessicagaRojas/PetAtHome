import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})


export class UsersComponent implements OnInit {
  public url: string;
  public title: string;
  public identity;
  public token;
  public page;
  public next_page;
  public prev_page;
  public total;
  public pages;
  public users: User[];
  public status: string;


  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService


  ) { 
    this.title = 'Gente',
    this.url = environment.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();

   }



  ngOnInit(): void {
    console.log('users.component ha sido cargado');
    this.actualPage();
  }

  // ----  ----

  actualPage(){
    this._route.params.subscribe(params => { //Capturamos parámetros de la URL con el método subscribe
      let page = + params['page']; //Recogemos el parámetro en la variable page, convirtiéndolo en entero con el símbolo +
      this.page = page; //Devuelve la página a la vista

      if(!params['page']){ //Si no hay parámetros muestra 1
        page = 1;
      }


      if(!page){ //si no existen páginas, mostrará solo 1
        page = 1;

      }else{ //Si devuelve páginas (en plural), las ordenamos
        this.next_page = page+1;
        this.prev_page = page-1;

        if(this.prev_page <= 0){ // Para que el mínimo de pags que muestre sea siempre 1
          this.prev_page = 1;
        }
      }

      this.getUsers(page);

    });
  }

// ---- Sacar listado de usuarios ----

  getUsers(page){ //Este método recibe como parámetro la página que le toque cargar
    this.userService.getUsers(page).subscribe(
      response => { 
        if(!response.users){ //Si response no existiera le damos un valor status de error 
          this.status = 'error';

        }else{
          this.total = response.total; //Estos elementos están dentro del array User
          this.users = response.users;
          this.pages = response.pages;

          if(page > this.pages){ //Si metemos una página que no existe (como usuarios) nos lleva a la pag1 
            this._router.navigate(['/gente',1]);
          }
        }
        
      },
      error => {
        let errorMessage = <any>error; //Guardamos en esta variable el error y lo mostramos por consola
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );

  }

}
