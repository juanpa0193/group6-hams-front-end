import { Component } from '@angular/core';
import { AppointmentSchedulerComponent} from './appointment-scheduler/appointment-scheduler.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {RouterLink } from '@angular/router';
import {AppointmentSummaryComponent} from './appointment-summary/appointment-summary.component';
import {MedicalRecordsComponent} from './medical-records/medical-records.component';
import {QuickActionsToolbarComponent} from './quick-actions-toolbar/quick-actions-toolbar.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'user-profile',
  imports: [
    AppointmentSchedulerComponent,
    UserInfoComponent,
    RouterLink,
    AppointmentSummaryComponent,
    MedicalRecordsComponent,
    QuickActionsToolbarComponent,
    NgIf,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  appointmentScheduldingMode = false;

  constructor() {
  }

  handleAppointmentSchedulingMode(value: boolean): void {
    this.appointmentScheduldingMode = value;
    console.log('Parent value updated to:', this.appointmentScheduldingMode)
  }

}
