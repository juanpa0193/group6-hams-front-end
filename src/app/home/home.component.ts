import { Component } from '@angular/core';
import {LoginFormComponent} from './login-form/login-form.component';

@Component({
  selector: 'app-home',
  imports: [
    LoginFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
