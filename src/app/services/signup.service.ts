import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SignupFormModel} from '../signup/signup-form/signup-form.model';
import {catchError, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private http: HttpClient) { }

  postUser(signupForm: SignupFormModel){
    console.log(signupForm.email);
    return this.http.post('http://localhost:8010/users/signUp', {
      email: signupForm.email,
      password: signupForm.password,
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      phoneNumber: signupForm.phoneNumber,
      isDoctor: signupForm.isDoctor
    }).pipe(
      catchError(error => {
        console.log('Error creating user data', error);
        return throwError(() => error);
      })
    )

  }

}
