import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../environments/environment';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

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
  public status;
  public stats;


  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    public userService: UserService,
  ) {
    this.url = environment.url;
    this.identity = this.userService.getIdentity(); //Método para sacar el usuario logeado
    this.token = this.userService.getToken(); //Inicializamos la propiedad con el token almacenado en esta variable
    this.stats = this.userService.getStats(); // GetStats saca los diferentes valores de los usuarios para utilizar contadores (las estadísticas)
    

   }

  ngOnInit(): void {
  }

}
