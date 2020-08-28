import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { Credentials } from '../../interfaces/credentials';

import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
    public user:User;
    public identity;
    public token;

    formLogin: FormGroup;


  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,

  ) {   }

  ngOnInit(): void {
    console.log('Componente cargando...');

    this.formLogin = this.formBuilder.group({
      nick: ['', Validators.required],
      role: ['ROLE_USER'],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    alert("¡Dentro! :D ");
    // Llamar al backend
    this.userService.signup(this.formLogin.value).subscribe((data) => {
      console.log(data);
    });

     this.identity = response.user;


      if(!this.identity || !this.identity._id){
        this.status = 'error';
      }else{
        this.status = 'success'; 
        //PERSISTIR datos del usuario
        localStorage.setItem('identity', JSON.stringify(this.identity));
  
        //TOKEN
        this.getToken();
  }
}
/*
error => {
  var errorMessage = <any>error;
  console.log(errorMessage);

  if(errorMessage != null){
    this.status = 'error';
  } 
}*/


  getToken(){
    this.userService.signup(this.user, 'true').subscribe(
      response => {
        this.token = response.token;
    
        if(this.token <= 0){
          this.status = 'error';
        }else{
          this.status = 'success'; 
          //PERSISTIR datos del usuario en Local Storage
          localStorage.setItem('token',this.token); //En LocalStorage no puedes guardar objetos de JS, hay que convertirlo en Json string

          this.getToken(); //Conseguir token mediante petición AJAX
  }
},
/*
error => {
  var errorMessage = <any>error;
  console.log(errorMessage);

  if(errorMessage != null){
    this.status = 'error';
  
  }
}
  };

}
*/


/*
this.userService.signup(this.user).subscribe(
  response => {
    this.identity = response.user;

    if(!this.identity || !this.identity._id){
      this.status = 'error';
    }else{
      this.status = 'success'; //PERSISTIR datos del usuario

      //TOKEN


    }
  }
  this.status = 'success';
)

*/