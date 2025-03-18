import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfigService} from './api-config.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private readonly baseURL: string;

  constructor( private http: HttpClient, private apiConfig: ApiConfigService ) {
    this.baseURL = apiConfig.getBaseUrl();
  }

  getDoctorsAll(): Observable<any[]>{

    return this.http.get<any[]>(`${this.baseURL}/doctors`);

  }
}
