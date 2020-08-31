import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';


import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public url: string;
  public identity;
  public user: User; //Creamos el objeto de User para rellenar y modificarlo
  public token;
  public publication: Publication;
  public status;
  public stats;
  form: FormGroup;



  constructor(
    private httpClient: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    public userService: UserService,
    public publicationService: PublicationService,
   // public _uploadService: UploadService,
    private formBuilder: FormBuilder

  ) {
    this.url = environment.url;
    this.identity = this.userService.getIdentity(); //Método para sacar el usuario logeado
    this.token = this.userService.getToken(); //Inicializamos la propiedad con el token almacenado en esta variable
    this.stats = this.userService.getStats(); // GetStats saca los diferentes valores de los usuarios para utilizar contadores (las estadísticas)


   }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      text: ['', Validators.required],
      file: ['', Validators.required],
      user: ['', Validators.required] //to do -> Se tiene que pasar el usuario
    });
  }
/*
  onSubmit(form, $event){
		this.publicationService.addNewPublication(this.token, this.publication).subscribe(
			response => {
				if(response.publication){
					//this.publication = response.publication;
					
					if(this.filesToUpload && this.filesToUpload.length){
					//Subir imagen
					this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id, [], this.filesToUpload, this.token, 'image')
					                   .then((result:any) => {
					                   		this.status = 'success';
					                   		this.publication.file = result.image;
											form.reset();
											this._router.navigate(['/timeline']);
											this.sended.emit({send:'true'});
					                   	});
					}else{
                   		this.status = 'success';
						form.reset();
						this._router.navigate(['/timeline']);
						this.sended.emit({send:'true'});
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

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}

  // Output 
  /*
	@Output() sended = new EventEmitter();
	sendPublication(event){
		this.sended.emit({send:'true'});
	}*/

}


