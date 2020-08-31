import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';


 
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
  public page;
  public pages;
  public itemsPerPage;
  public total;
  public title: string;
  public showImage;



  public status: string;
  public publications: Publication[];

  constructor(    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    private userService: UserService,
    private publicationService: PublicationService
    


  ) { 
    this.url = environment.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.page = 1;
    this.title = 'Timeline';


   }
   ngOnInit(){
		console.log('timeline.component cargado correctamente!!');
		this.getPublications(this.page);
	}

	getPublications(page, adding = false){
		this.publicationService.getPublications(this.token, page).subscribe(
			response => {
				if(response.publications){
					this.total = response.total_items;
					this.pages = response.pages;
					this.itemsPerPage = response.items_per_page;

					if(!adding){
						this.publications = response.publications;
					}else{
						var arrayA = this.publications;
						var arrayB = response.publications;
						this.publications = arrayA.concat(arrayB);

					}

					if(page > this.pages){
						//this._router.navigate(['/home']);
					}
				}else{
					this.status = 'error';
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

	public noMore = false;
	viewMore(){
		this.page += 1;

		if(this.page == this.pages){
			this.noMore = true;
		}

		this.getPublications(this.page, true);
	}

	refresh(event = null){
		this.getPublications(1);
	}

	showThisImage(id){
		this.showImage = id;
	}

	hideThisImage(id){
		this.showImage = 0;
	}

	deletePublication(id){
		this.publicationService.deletePublication(this.token, id).subscribe(
			response => {
				this.refresh();
			},
			error => {
				console.log(<any>error);
			}
		);
	}
}
  





   
