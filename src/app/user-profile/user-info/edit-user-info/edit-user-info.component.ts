import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'edit-user-info',
  templateUrl: './edit-user-info.component.html',
  imports: [ReactiveFormsModule],
  styleUrl: './edit-user-info.component.css'
})
export class EditUserInfoComponent implements OnInit {
  @Input() user: any; // Accept the user data as an input
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() saveChangesEvent = new EventEmitter<void>();

  editForm!: FormGroup; // Use the non-null assertion operator to avoid the TypeScript error

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {
    console.log('User data received in EditUserInfoComponent:', this.user); // Debugging log
    // Initialize the form with user data
    this.editForm = this.fb.group({
      firstName: [this.user?.firstName || ''],
      lastName: [this.user?.lastName || ''],
      email: [this.user?.email || ''],
      phoneNumber: [this.user?.phoneNumber || ''],
      date_of_birth: [this.user?.patient?.date_of_birth || ''],
      gender: [this.user?.patient?.gender || ''],
      blood_type: [this.user?.patient?.blood_type || ''],
      address: [this.user?.patient?.address || ''],
      emergency_contact_name: [this.user?.patient?.emergency_contact_name || ''],
      emergency_contact_relation: [this.user?.patient?.emergency_contact_relation || ''],
      emergency_contact_phone: [this.user?.patient?.emergency_contact_phone || '']
    });
  }

  saveChanges() {
    const userId = this.user.id;

    // Get the updated form data
    const formData = this.editForm.value;

    // Send the data to the backend
    this.http.put(`http://localhost:8010/users/${userId}`, formData).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        this.saveChangesEvent.emit(); // Emit the saveChanges event after successful save
      },
      (error) => {
        console.error('Error updating user:', error);
        alert('Failed to update profile. Please try again.');
      }
    );
  }

  cancel() {
    console.log('Cancel button clicked'); // Debugging log
    this.cancelEvent.emit(); // Emit the cancel event
  }
}