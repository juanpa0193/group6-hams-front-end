import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { ApiConfigService } from './api-config.service';
import {AppointmentFormModel} from '../user-profile/models/appointment.model';

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

  getUserAppointments(userId: string){
    return this.http.get<any[]>(`${this.baseURL}/appointments/${userId}`);
  }

  postAppointment(appointment: AppointmentFormModel, patientId: string){
    return this.http.post<any>(`${this.baseURL}/appointments/scheduleAppointment/${patientId}`, {
      doctor_id: appointment.doctor_id,
      date: appointment.date,
      time: appointment.time,
      appointmentType: appointment.appointmentType,
      department: appointment.department,
      reason: appointment.reason
    }).pipe(
      catchError(error => {
        console.log('Error creating appointment data', error);
        return throwError(() => error);
      })
    );
  }
}
