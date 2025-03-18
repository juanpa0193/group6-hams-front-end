import { Component } from '@angular/core';
import {Router, RouterLink } from '@angular/router';

@Component({
  selector: 'login-form',
  imports: [
    RouterLink
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})


export class LoginFormComponent {

  constructor(private router: Router) {

  }

  btnClick = function() {
    console.log('clicked');
  }


}
