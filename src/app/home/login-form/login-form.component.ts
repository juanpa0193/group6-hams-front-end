import { Component } from '@angular/core';
import {Router, RouterLink } from '@angular/router';
import { AuthService} from '../../services/auth.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'login-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})


export class LoginFormComponent {

  loginForm: FormGroup;
  loginError = '';
  loading = false;

  constructor(private router: Router,
              private authService: AuthService,
              private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  btnClick() {
    if (this.loginForm.invalid) {
      console.log('Login Form Invalid');
      return;
    }

    this.loading = true;
    this.loginError = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login Success!', response)
        this.router.navigate(['/user']);
      }, error: (error) => {
        console.error('Login Unsuccessful :(', error);
        // Show error message
      }
    })
    return false;
  }

}
