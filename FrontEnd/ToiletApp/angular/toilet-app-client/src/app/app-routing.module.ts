import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ListToiletsComponent } from './list-toilets/list-toilets.component';
import { ListOpinionsComponent } from './list-opinions/list-opinions.component';
import { UpdateToiletComponent } from './update-toilet/update-toilet.component';
import { UpdateOpinionComponent } from './update-opinion/update-opinion.component';
import { CreateOpinionComponent } from './create-opinion/create-opinion.component';
import { CreateToiletComponent } from './create-toilet/create-toilet.component';
import { ApiService } from './api.service';
import { UpdateUserComponent } from './update-user/update-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';

const routes: Routes = [
  { path: 'list-toilets', component: ListToiletsComponent },
  { path: 'update-user', component: UpdateUserComponent },
  { path: 'delete-user', component: DeleteUserComponent },
  { path: 'list-opinions/:id', component: ListOpinionsComponent },
  { path: 'update-toilet/:id', component: UpdateToiletComponent, canActivate: [ApiService] },
  { path: 'update-opinion/:id', component: UpdateOpinionComponent, canActivate: [ApiService] },
  { path: 'create-toilet', component: CreateToiletComponent, canActivate: [ApiService] },
  { path: 'create-opinion/:id', component: CreateOpinionComponent, canActivate: [ApiService] },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
