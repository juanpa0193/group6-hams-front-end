import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, Observable, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ApiConfigService } from './api-config.service';
import {jwtDecode} from 'jwt-decode';

interface LoginResponse {
  token: string;
  message: string;
}

interface CustomJwtPayload {
  email: string;
  userId: number; // Add the userId property
  userType: string;
  exp?: number; // Optional: Expiration time
  iat?: number; // Optional: Issued at time
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
          if (res && res.token) {
            // Store token
            localStorage.setItem('token', res.token);
            // Parse JWT to get the user's info
            const userInfo = this.getUserFromToken(res.token);
            if (userInfo && userInfo.userId) { // TypeScript now recognizes userId
              // Fetch full user data from the backend
              this.fetchFullUserData(userInfo.userId);
            } else {
              console.error('Failed to decode user info or userId is missing.');
            }
          }
        }),
        catchError(error => {
          console.log('Error logging in', error);
          return throwError(() => error);
        })
      );
  }

  private getUserFromToken(token: string): CustomJwtPayload | null {
    try {
      return jwtDecode<CustomJwtPayload>(token); // Use the custom interface
    } catch (e) {
      console.error('Error decoding token:', e);
      return null; // Return null if decoding fails
    }
  }

  // private getUserFromToken(token: string) {
  //   // Basic parsing of JWT payload
  //   try {
  //     return jwtDecode(token);
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }

  fetchFullUserData(userId: number) {
    this.http.get(`${this.baseURL}/auth/users/${userId}`).subscribe(
      (user: any) => {
        console.log('Fetched full user data:', user);
        this.currentUserSubject.next(user);
      },
      (error) => {
        console.error('Error fetching full user data:', error);
      }
    );
  }

}
