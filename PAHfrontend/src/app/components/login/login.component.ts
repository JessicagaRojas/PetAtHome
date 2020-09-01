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
      email: ['', Validators.required],
      password: ['', Validators.required],
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
	}
  


  /*
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
    );*/





getToken(){
  this.userService.signup(this.user, 'true').subscribe(
    response => {
      this.token = response.token;
      
      console.log(this.token);

      if(this.token.length <= 0){
        this.status = 'error';
      }else{
        
        // PERSISTIR TOKEN DEL USUARIO
        localStorage.setItem('token',this.token);

        // Conseguir los contadores o estadisticas del usuario
        this.getCounters();
      }
      
    },
    error => {
      var errorMessage = <any>error;
      console.log(errorMessage);

      if(errorMessage != null){
        this.status = 'error';
      }
    }
  );
}

getCounters(){
  this.userService.getCounters().subscribe(
    response => {
      localStorage.setItem('stats', JSON.stringify(response));
      this.status = 'success';
      this._router.navigate(['/']);
    },
    error => {
      console.log(<any>error);
    }
  )

}
}