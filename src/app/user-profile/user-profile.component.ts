import {Component, OnInit} from '@angular/core';
import { AppointmentSchedulerComponent} from './appointment-scheduler/appointment-scheduler.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {Router, RouterLink} from '@angular/router';
import {AppointmentSummaryComponent} from './appointment-summary/appointment-summary.component';
import {MedicalRecordsComponent} from './medical-records/medical-records.component';
import {QuickActionsToolbarComponent} from './quick-actions-toolbar/quick-actions-toolbar.component';
import {NgIf} from '@angular/common';
import {AuthService} from '../services/auth.service';

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
export class UserProfileComponent implements OnInit {
  currentUser = null;
  loading = true;
  appointmentScheduldingMode = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    // Subscribe to the currentUser Auth service observable
    this.authService.currentUser$.subscribe(user => {

      if(user) {
        this.currentUser = user;
        this.loading = false;
      } else {
        // Redirect back to login or something
        this.loading = false;
        console.log('No currentUser found, redirecting home...');
        this.router.navigate(['/']);
        //return false;
      }
    })
  }

  handleAppointmentSchedulingMode(value: boolean): void {
    this.appointmentScheduldingMode = value;
    console.log('Parent value updated to:', this.appointmentScheduldingMode)
  }

}
