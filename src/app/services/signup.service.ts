import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignupFormModel} from '../signup/signup-form/signup-form.model';
import {catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  // Testing
  getUsers() {
    return this.http.get('http://localhost:8010/users')
      .subscribe({
        next: (data: any) => {
          console.log('Response:', data); // Add this to debug
          //this.products = data; // Make sure response is an array
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        }
      });
  }

  postUser(signupForm: SignupFormModel){
    console.log(signupForm.email);
    return this.http.post('http://localhost:8010/users/add', {
      email: signupForm.email,
      password: signupForm.password,
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      phoneNumber: signupForm.phoneNumber,
      userType: "P"
    }).pipe(
      catchError(error => {
        console.log('Error creating user data', error);
        return throwError(() => error);
      })
    )

  }

}
