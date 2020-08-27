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
  }

}
