import { UserService } from './../../services/user.service';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
  public user: User; //Creamos el objeto de User para rellenar y modificarlo
  public title: string;

  formUser: FormGroup;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.title = 'Regístrate!';
  }

  ngOnInit(): void {
    console.log('Componente cargando...');

    this.formUser = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      nick: ['', Validators.required],
      role: ['ROLE_USER'],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  onSubmit() {
    alert("¡Gracias por registrarte!");
    // Llamar al backedn
    this.userService.register(this.formUser.value).subscribe((data) => {
      console.log(data);
    });
  }

}
