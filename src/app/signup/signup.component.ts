import { Component } from '@angular/core';
import {SignupFormComponent} from './signup-form/signup-form.component';

@Component({
  selector: 'app-signup',
  imports: [
    SignupFormComponent
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

}
