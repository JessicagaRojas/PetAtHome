
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  public user: User; //Creamos el objeto de User para rellenar y modificarlo
  public title: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {this.title = 'Regístrate!';
    this.user = new User("",
      "",
      "",
      "",
      "",
      "",
      "ROLE_USER",
      "");
   }

  ngOnInit(): void {
    console.log('Componente cargando...');
  }

  onSubmit(){
    alert("¡Gracias por registrarte!");
  }

}
