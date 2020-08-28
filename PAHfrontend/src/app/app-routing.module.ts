import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

//Importo los componentes a los que les quiero hacer una página aparte. Los que NO SON FIJOS
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { Error404Component } from './components/error404/error404.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'follow', component: RegisterComponent },
  { path: 'seguidos', component: RegisterComponent },
  { path: 'gente', component: UsersComponent }, //La misma ruta de gente pero sin parámetro
  { path: 'gente:page', component: UsersComponent },
  { path: '**', component: Error404Component },


  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
