import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Publication } from '../../models/publication';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public url: string;
  public identity;
  public token;
  public users: User[];
  public status: string;

  constructor(    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService,
    


  ) { 
    this.url = environment.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.publication = this.publication;

   }

  ngOnInit(): void {
  }

  onSubmit() {}

}
