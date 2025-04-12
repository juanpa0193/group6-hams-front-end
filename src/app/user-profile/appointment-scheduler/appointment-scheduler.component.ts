import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { AppointmentService} from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import {AppointmentFormModel} from '../models/appointment.model';
import { UserModel } from '../models/user.model';
import {AuthService} from '../../services/auth.service';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  nextAvailable?: string;
}

interface CalendarDay {
  date: string;
  dayNumber: number;
  available: boolean;
}

interface AppointmentType {
  id: string;
  type: string;
}

@Component({
  selector: 'appointment-scheduler',
  imports: [
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    NgIf,
    NgStyle
  ],
  templateUrl: './appointment-scheduler.component.html',
  styleUrl: './appointment-scheduler.component.css'
})
export class AppointmentSchedulerComponent implements OnInit {
  currentUser: UserModel | null = null;

  @Output() closeScheduling = new EventEmitter<void>();
  @Output() dismissAppointmentScheduler = new EventEmitter<boolean>();

  appointmentForm: FormGroup;
  currentStep = 0;
  steps = ['Service', 'Doctor', 'Date & Time', 'Confirmation'];
  submitted = false;
  appointmentTypes: { [key: string]: string } = {};
  appointmentTypesArray: AppointmentType[] = [];
  appointmentConfirmed = false;

  availableDoctors: Doctor[] = [];

  calendarDays: CalendarDay[] = [];
  availableTimeSlots: string[] = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ];

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private appointmentService: AppointmentService,
              private doctorService: DoctorService) {
    this.appointmentForm = this.formBuilder.group({
      appointmentType: ['', Validators.required],
      department: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(10)]],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      confirmTerms: [false, Validators.requiredTrue]
    });

    // Generate calendar days for the current month
    this.generateCalendarDays();

  }

  ngOnInit() {

    try {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    } catch (error) {
      console.log('Error retrieving user date', error);
      this.dismissScheduler();
    }

    this.getAppointmentTypes();
    this.getAllDoctors();
  }

  generateCalendarDays(): void {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get the first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Get the number of days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create an array for the calendar grid
    this.calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push({
        date: '',
        dayNumber: 0,
        available: false
      });
    }

    // Add cells for each day of the month
    const currentDate = today.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      // Days before today are not available
      const available = i >= currentDate;

      // Format date as YYYY-MM-DD
      const date = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;

      this.calendarDays.push({
        date: date,
        dayNumber: i,
        available: available
      });
    }
  }

  selectDoctor(doctorId: string): void {
    this.appointmentForm.patchValue({ doctorId });
  }

  selectDate(date: string): void {
    this.appointmentForm.patchValue({ date });
  }

  selectTime(time: string): void {
    this.appointmentForm.patchValue({ time });
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.currentStep++;
    } else {
      this.submitted = true;
    }
  }

  previousStep(): void {
    this.currentStep--;
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 0:
        return this.appointmentForm.get('appointmentType')!.valid &&
          this.appointmentForm.get('department')!.valid &&
          this.appointmentForm.get('reason')!.valid;
      case 1:
        return this.appointmentForm.get('doctorId')!.valid;
      case 2:
        return this.appointmentForm.get('date')!.valid &&
          this.appointmentForm.get('time')!.valid;
      default:
        return true;
    }
  }

  submitAppointment(): void {

    if (this.appointmentForm.valid) {
      console.log('Appointment form submitted:', this.appointmentForm.value);

      const appointment: AppointmentFormModel = {
        doctor_id: this.appointmentForm.value.doctorId,
        date: this.appointmentForm.value.date,
        time: this.appointmentForm.value.time,
        appointmentType: this.appointmentForm.value.appointmentType,
        department: this.appointmentForm.value.department,
        reason: this.appointmentForm.value.reason
      }

      this.appointmentService.postAppointment(appointment, this.currentUser!.userId).subscribe({
        next: (response) => {
          console.log('Appointment scheduled successfully!', response);
          this.currentStep = -1;
          this.appointmentConfirmed = true;
          return;
        },
        error: (error) => {
          console.error('Registration failed', error);
          return false;
          // Show error message
        }
      })

    }
  }

  goBack(): void {
    this.dismissScheduler();
  }

  showError(controlName: string): boolean {
    const control = this.appointmentForm.get(controlName);
    return (control?.invalid && (control?.touched || this.submitted)) || false;
  }

  getSelectedDoctorName(): string {
    const doctorId = this.appointmentForm.get('doctorId')?.value;
    const doctor = this.availableDoctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : '';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDepartmentName(departmentCode: string): string {

    const departments: { [key: string]: string } = {
      'general-medicine': 'General Medicine',
      'cardiology': 'Cardiology',
      'dermatology': 'Dermatology',
      'orthopedics': 'Orthopedics',
      'pediatrics': 'Pediatrics',
      'neurology': 'Neurology'
    };

    return departments[departmentCode] || departmentCode;
  }

  getAppointmentTypeName(): string {

    return this.appointmentForm.get('appointmentType')?.value;

  }

  getAppointmentTypes(){
    this.appointmentService.getAppointmentType().subscribe({
      next: (data: AppointmentType[])=> {

        // Transform appointmentTypes data into an array
        this.appointmentTypesArray = data.map( item => ({
          id: item.id,
          type: item.type
        }))
      },
      error: (error) => {
        console.log('Error fetching appointment types:',error);
        // this.setFallbackAppointmentTypes();
      }
    })
  }

  getAllDoctors() {
    this.doctorService.getDoctorsAll().subscribe({
      next: (data: Doctor[]) => {
        console.log('Response',data); // DEBUG

        // Transform Doctor data into an array
        this.availableDoctors = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          specialization: item.specialization,
          imageUrl: item.imageUrl,
          rating: item.rating,
          reviewCount: item.reviewCount,
          nextAvailable: item.nextAvailable
        }))
      }
    })
  }

  // Fallback method in case API fails
//   setFallbackAppointmentTypes() {
//     const staticTypes = {
//       'general-checkup': 'General Checkup',
//       'follow-up': 'Follow-up Visit',
//       'specialist': 'Specialist Consultation',
//       'vaccination': 'Vaccination',
//       'lab-test': 'Laboratory Test'
//     };
//
//     this.appointmentTypes = staticTypes;
//     this.appointmentTypesArray = Object.entries(staticTypes).map(([type]) => ({
//       type
//     }));
// }

  closeConfirmation() {
    this.dismissScheduler();
  }

  dismissScheduler() {
    this.dismissAppointmentScheduler.emit(false);
  }
}
