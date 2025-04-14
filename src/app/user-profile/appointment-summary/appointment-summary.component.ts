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
  scheduledAppointments: ScheduledAppointmentModel[] = [];

  constructor(private authService: AuthService,
              private appointmentService: AppointmentService,
              private userService: UserService) {

  }

  ngOnInit() {

    try {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (this.currentUser) {
          this.getAppointments();
        }
      })
    } catch (error) {
      console.log('Error retrieving user date', error);
      //this.dismissScheduler();
    }
  }

  getAppointments() {
    this.appointmentService.getUserAppointments(this.currentUser!.userId)
      .pipe(
        switchMap((appointments: ScheduledAppointmentModel[]) => {
          if (!appointments.length) return of({ appointments: [], users: []});

          // Filter out cancelled appointments
          const filteredAppointments = appointments.filter(appointment =>
                 appointment.status !== 'canceled'
          )
          console.log(filteredAppointments);

          if (!filteredAppointments.length) return of({ appointments: [], users: []});

          // Extract user id's from the returned appointments
          const userIds = [... new Set([
            ...filteredAppointments.map(app => app.patientId),
            ...filteredAppointments.map(app => app.doctorId)
          ])
          ];

          // Fetch all users in a single call (forkjoin combines multiple observables)
          return forkJoin({
            appointments: of(filteredAppointments),
            users: this.userService.getUserByIds(userIds)
          })
        })
      )
      .subscribe({
      next: (data) => {
        const { appointments, users } = data;


        this.scheduledAppointments = appointments.map( item => {
          const patient = users.find( user => user.id === item.patientId);
          const doctor = users.find( users => users.id === item.doctorId);
          const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown';
          const doctorName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';

          return {
            scheduledWith: this.currentUser?.userType === 'Patient' ? `Dr.${doctorName}` : patientName,
            appointmentId: item.appointmentId,
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

  cancelAppointment(appointmentId: string): void {
    console.log(appointmentId)
    this.appointmentService.cancelAppointment(appointmentId)
      .subscribe({
        next: (response) => {
          console.log(response);

          this.getAppointments();
        },
        error: (error) => {
          console.error('Error retrieving appointment data', error);
        }
      });
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
