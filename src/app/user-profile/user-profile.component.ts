import {Component, OnInit} from '@angular/core';
import { AppointmentSchedulerComponent} from './appointment-scheduler/appointment-scheduler.component';
import {UserInfoComponent} from './user-info/user-info.component';
import {EditUserInfoComponent} from './user-info/edit-user-info/edit-user-info.component';
import {Router, RouterLink} from '@angular/router';
import {AppointmentSummaryComponent} from './appointment-summary/appointment-summary.component';
import {MedicalRecordsComponent} from './medical-records/medical-records.component';
import {QuickActionsToolbarComponent} from './quick-actions-toolbar/quick-actions-toolbar.component';
import {NgIf} from '@angular/common';
import {AuthService} from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'user-profile',
  imports: [
    AppointmentSchedulerComponent,
    UserInfoComponent,
    EditUserInfoComponent,
    FormsModule,
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
  currentUser: any = null;
  loading = true;
  appointmentScheduldingMode = false;
  isEditing = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    // Subscribe to the currentUser Auth service observable
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if(user) {
        // Load profile
        // ...
        console.log('Fetched user data in user-profile:', this.currentUser); // Debugging log
        this.loading = false;
        console.log('Succesfully logged in!',user);
      } else {
        // Redirect back to login or something
        this.loading = false;
        console.log('redirecting home');
        this.router.navigate(['/']);
        //return false;
      }
    })
  }

  handleAppointmentSchedulingMode(value: boolean): void {
    this.appointmentScheduldingMode = value;
    console.log('Parent value updated to:', this.appointmentScheduldingMode)
  }

  // Switch to edit mode
  startEditing() {
    this.isEditing = true;
    console.log('Edit mode activated'); // Debugging log
  }

  stopEditing() {
    this.isEditing = false; // Switch back to view mode
    console.log('Edit mode deactivated'); // Debugging log
  }

}
