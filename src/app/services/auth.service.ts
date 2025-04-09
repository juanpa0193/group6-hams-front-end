import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ApiConfigService } from './api-config.service';
import {jwtDecode} from 'jwt-decode';

interface LoginResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseURL: string;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.baseURL = apiConfigService.getBaseUrl();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseURL}/auth`, { email: email, password: password })
      .pipe(
        tap(res => {
          if(res && res.token) {
            // Store token
            localStorage.setItem('token', res.token);
            // Parse JWT to get the user's info
            const userInfo = this.getUserFromToken(res.token);
            this.currentUserSubject.next(userInfo);
          }
        }),
        catchError(error => {
          console.log('Error logging in', error);
          return throwError(() => error);
        })
      );
  }

  private getUserFromToken(token: string) {
    // Basic parsing of JWT payload
    try {
      return jwtDecode(token);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

}
