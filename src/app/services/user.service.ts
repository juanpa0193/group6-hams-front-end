import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from './api-config.service';
import {forkJoin, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseURL: string;

  constructor(private http: HttpClient, private apiConfig: ApiConfigService) {
    this.baseURL = apiConfig.getBaseUrl();
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/users/${userId}`);
  }

  getUserByIds(userIds: string[]): Observable<any[]>{

    // Make sure userIds isn't empty to avoid unnecessary API calls
    if (!userIds || userIds.length === 0) {
      return of([]);
    }

    // Since we don't have a batch endpoint, going to just create multiple observable calls using
    // the getUserId(single id parameter)
    return forkJoin(
      userIds.map(id => this.getUserById(id))
    );

  }

}
