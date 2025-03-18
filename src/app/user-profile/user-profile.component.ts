import { Component } from '@angular/core';
import { AppointmentSchedulerComponent} from './appointment-scheduler/appointment-scheduler.component';
import { AppointmentService} from '../services/appointment.service';

@Component({
  selector: 'user-profile',
  imports: [
    AppointmentSchedulerComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  appointmentTypes: String[] = [];

  constructor(private appointmentService: AppointmentService) {
  }

  getAppointmentType() {
    this.appointmentService.getAppointmentType().subscribe({
      next: (data: any) => {
        console.log('Response:', data); // DEBUG
        this.appointmentTypes = data;
      },
      error: (err: any) => {
        console.log('Error fetching products:',err);
      }
    })
  }

}
