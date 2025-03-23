import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfigService } from './api-config.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly baseURL: string;

  constructor( private http: HttpClient, private apiConfig: ApiConfigService ) {
    this.baseURL = apiConfig.getBaseUrl();
  }

  getAppointmentType(): Observable<any[]>{

    return this.http.get<any[]>(`${this.baseURL}/appointments/types`);

  }
}
