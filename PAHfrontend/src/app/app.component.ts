import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'string';
  public identity;
  //public user: User; //Creamos el objeto de User para rellenar y modificarlo


  constructor(
    public userService: UserService,
  ){
  this.title = 'PetAtHome'
  }

  ngOnInit(){
    this.identity = this.userService.getIdentity(); //Darle un valor a identity sacando la info guardada en LS
    console.log(this.identity); //Debería devolver un objeto completo del usuario identificado
  }

  ngDoCheck(){
    this.identity = this.userService.getIdentity(); //Cada vez que haya cambios de identificación, actualiza la lógica
  }

}


