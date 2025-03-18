import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { SignupService} from '../../services/signup.service';
import {SignupFormModel} from './signup-form.model';

@Component({
  selector: 'signup-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.css'
})
export class SignupFormComponent {

  signupForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private router: Router
  ) {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      terms: [false, Validators.requiredTrue],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    this.submitted = true;

    // If form does not pass validation
    if (this.signupForm.invalid) {
      console.log('error');
      return;
    }

    // Signup logic
    this.signupService.postUser(this.signupForm.value as SignupFormModel)
      .subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          // Reset the form
          this.signupForm.reset();
          this.submitted = false;
          // Optional - Implement Navigate to login or show success message
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Show error message
        }
      }); // This is important - you need to subscribe for this to work

    // Navigate to login page or dashboard after successful signup
    // this.router.navigate(['/login']);
  }



}
