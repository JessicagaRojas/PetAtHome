import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
//import { Credentials } from '../../interfaces/credentials';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
    public user:User;
    public url: string;
    public status: string;
    public identity;
    public token;


    formLogin: FormGroup;


  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private httpClient: HttpClient,

  ) { this.url = environment.url;}

  ngOnInit(): void {
    console.log('Componente cargando...');

    this.formLogin = this.formBuilder.group({
      email: ['dieguen@gmail.com', Validators.required],
      password: ['1234', Validators.required],
      gettoken: [true, Validators.required]
    });
  }

  onSubmit() {
    // Llamar al backend
    this.userService.signup(this.formLogin.value).subscribe( data => {
        console.log(data);
        this.identity = data.user;
        alert("¡Dentro! :D ");
        sessionStorage.setItem('token', data.token)
        this._router.navigateByUrl('/');
      },
      error => {
        alert( error.message);
      },() => {
        // No errors, route to new page
      }
    );

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

          //Redirección a la home tras logout
          this._router.navigate(['/']);
    }
  }
)}
}


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
 */
