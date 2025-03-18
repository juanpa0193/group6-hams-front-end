import { Routes } from '@angular/router';
import {HomeComponentTest} from './test-files/home/home-component-test.component';
import {HomeComponent} from './home/home.component';
import {Home3Component} from './test-files/home3/home3.component';
import {TestCompComponent} from './test-files/test-comp/test-comp.component';
import {SignupComponent} from './signup/signup.component';
import {UserProfileComponent} from './user-profile/user-profile.component';

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: "full"},
  {path: 'home', component: HomeComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'user', component: UserProfileComponent},
  {path: 'hometest', component: HomeComponentTest},
  {path: 'home3', component: Home3Component},
  {path: 'test', component: TestCompComponent},
];
