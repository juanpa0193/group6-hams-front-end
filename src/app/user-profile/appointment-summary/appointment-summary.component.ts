import {Component, OnInit} from '@angular/core';
import {UserModel} from '../models/user.model';
import {AuthService} from '../../services/auth.service';
import {AppointmentService} from '../../services/appointment.service';
import {ScheduledAppointmentModel} from '../models/appointment.model';
import {NgForOf} from '@angular/common';
import {forkJoin, of, switchMap} from 'rxjs';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'appointment-summary',
  imports: [
    NgForOf
  ],
  templateUrl: './appointment-summary.component.html',
  styleUrl: './appointment-summary.component.css'
})
export class AppointmentSummaryComponent implements OnInit {
  currentUser: UserModel | null = null;
  schduledAppointments: ScheduledAppointmentModel[] = [];

  constructor(private authService: AuthService,
              private appointmentService: AppointmentService,
              private userService: UserService) {

  }

  ngOnInit() {

    try {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (this.currentUser) {
          this.getAppointmentsTest();
        }
      })
    } catch (error) {
      console.log('Error retrieving user date', error);
      //this.dismissScheduler();
    }
  }

  // getAppointments() {
  //   this.appointmentService.getUserAppointments(this.currentUser!.userId).subscribe({
  //     next: (data: ScheduledAppointmentModel[]) => {
  //       console.log('Response', data); // DEBUG
  //       this.schduledAppointments = data.map(item => ({
  //         patientId: item.patientId,
  //         doctorId: item.doctorId,
  //         appointmentDate: this.formatDateString(item.appointmentDate),
  //         appointmentTime: this.formatTimeString(item.appointmentTime),
  //         appointmentType: item.appointmentType,
  //         reason: item.reason,
  //         status: item.status
  //       }))
  //     }
  //   })
  // }

  getAppointmentsTest() {
    this.appointmentService.getUserAppointments(this.currentUser!.userId)
      .pipe(
        switchMap((appointments: ScheduledAppointmentModel[]) => {
          if (!appointments.length) return of({ appointments: [], users: []});

          // Extract user id's from the returned appointments
          const userIds = [... new Set([
            ...appointments.map(app => app.patientId),
            ...appointments.map(app => app.doctorId)
          ])
          ];

          // Fetch all users in a single call (forkjoin combines multiple observables)
          return forkJoin({
            appointments: of(appointments),
            users: this.userService.getUserByIds(userIds)
          })
        })
      )
      .subscribe({
      next: (data) => {
        const { appointments, users } = data;


        this.schduledAppointments = appointments.map( item => {
          const patient = users.find( user => user.id === item.patientId);
          const doctor = users.find( users => users.id === item.doctorId);
          const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
          const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';

          return {
            scheduledWith: this.currentUser?.userType === 'Patient' ? `Dr.${doctorName}` : patientName,
            patientId: item.patientId,
            doctorId: item.doctorId,
            appointmentDate: this.formatDateString(item.appointmentDate),
            appointmentTime: this.formatTimeString(item.appointmentTime),
            appointmentType: item.appointmentType,
            reason: item.reason,
            status: item.status
          }
        })
      },
        error: error => {
        console.log('Error retrieving appointment data', error);
        }
    })
  }

  formatDateString(dateString: string): string {

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);

    } catch (error) {
      console.log('Error formatting date:', error);
      return dateString;
    }

  }

  formatTimeString(timeString: string): string {
    if (!timeString) return '';

    try {
      // Create a date object with a dummy date in order to use Intl.DateTimeFormat
      const date = new Date(`2000-01-01T${timeString}`);

      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);

    } catch (error) {
      console.log('Error formatting time:', error);
      return timeString;
    }

  }

}
