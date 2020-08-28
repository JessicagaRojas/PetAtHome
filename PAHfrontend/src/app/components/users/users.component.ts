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
  }

}
