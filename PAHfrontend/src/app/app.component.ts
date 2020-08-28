import { Component } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  public title = 'string';
  public identity;
  public user: User; //Creamos el objeto de User para rellenar y modificarlo




  constructor(
    public userService: UserService,
  ){
  this.title = 'PetAtHome'
  }

  ngOnInit(){
    this.identity = this.userService.getIdentity(); //Darle un valor a identity sacando la info guardada en LS
    console.log(this.identity);
  }

}


