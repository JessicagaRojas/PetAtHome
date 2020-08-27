
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { NgForm } from '@angular/forms';

import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})


export class RegisterComponent implements OnInit {
  private user: User; //Creamos el objeto de User para rellenar y modificarlo
  errorMsg: string; //Definimos el error que dará el input


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    //public status:string,
    public userService: UserService  ) {}

  ngOnInit(): void {
    console.log('Componente cargando...');
  }

  register(registerForm: NgForm): void {
    console.log(registerForm);
    if (!registerForm.valid) { //Si el registro NO es válido...
      setTimeout(() => this.errorMsg = '', 2500); //...tras 2.5seg salta error
      this.errorMsg = 'Revisa tus campos';
      return;
    }
    const user: User = registerForm.value; // "user" recoge todo lo que hay en el modelo de User (id, name, email, password)
    this.userService.register(user)  // Registra esos valores
      .subscribe(console.log); //Imprescindible 
  }


  onSubmit(){ //Cuando clickamos el botón Submit en html, se inicia este método que conecta con el service, guarda los datos y de ahí al API
    this.user.role = "ROLE_USER";
    this.userService.register(this.user);
  }

}
