import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
//import { Credentials } from '../../interfaces/credentials';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]

})
export class LoginComponent implements OnInit {
    public user:User;

  constructor(
    public userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {   }

  ngOnInit(): void {
    console.log('Componente cargando...');

    this.formUser = this.formBuilder.group({
      nick: ['', Validators.required],
      role: ['ROLE_USER'],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }



onSubmit(): {
  alert("¡Dentro! :D");
  // Llamar al backend
  this.userService.(this.formUser.value).subscribe((data) => {
    console.log(data);
  });
}

}
