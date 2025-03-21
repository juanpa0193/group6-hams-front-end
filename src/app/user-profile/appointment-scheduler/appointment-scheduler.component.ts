import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import { AppointmentService} from '../../services/appointment.service';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  nextAvailable: string;
}

interface Doctor_new {
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
  @Output() closeScheduling = new EventEmitter<void>();

  appointmentForm: FormGroup;
  currentStep = 0;
  steps = ['Service', 'Doctor', 'Date & Time', 'Confirmation'];
  submitted = false;
  appointmentTypes: { [key: string]: string } = {};
  appointmentTypesArray: AppointmentType[] = [];

  availableDoctors: Doctor[] = [
    {
      id: 'doc1',
      name: 'Dr. Emily Johnson',
      specialization: 'General Medicine',
      rating: 4.8,
      reviewCount: 124,
      nextAvailable: 'Tomorrow'
    },
    {
      id: 'doc2',
      name: 'Dr. Michael Chen',
      specialization: 'Cardiology',
      rating: 4.9,
      reviewCount: 98,
      nextAvailable: 'Thursday, Feb 15'
    },
    {
      id: 'doc3',
      name: 'Dr. Sarah Williams',
      specialization: 'Dermatology',
      rating: 4.7,
      reviewCount: 86,
      nextAvailable: 'Friday, Feb 16'
    },
    {
      id: 'doc4',
      name: 'Dr. Robert Garcia',
      specialization: 'Orthopedics',
      rating: 4.6,
      reviewCount: 112,
      nextAvailable: 'Monday, Feb 19'
    }
  ];

  calendarDays: CalendarDay[] = [];
  availableTimeSlots: string[] = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ];

  constructor(private formBuilder: FormBuilder, private appointmentService: AppointmentService) {
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
    this.getAppointmentTypes();
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
    this.submitted = true;

    if (this.appointmentForm.valid) {
      console.log('Appointment form submitted:', this.appointmentForm.value);

      // Here you would typically send the form data to your API
      // this.appointmentService.scheduleAppointment(this.appointmentForm.value)
      //   .subscribe({
      //     next: (response) => {
      //       // Handle success
      //     },
      //     error: (error) => {
      //       // Handle error
      //     }
      //   });

      // For demo purposes, just log the values
      alert('Appointment scheduled successfully!');
      this.goBack();
    }
  }

  goBack(): void {
    this.closeScheduling.emit();
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

  getAppointmentTypeName(typeCode: string): string {

    if(this.appointmentTypes && this.appointmentTypes[typeCode]){
      return this.appointmentTypes[typeCode] as string;
    }

    return 'error';

    // FIXME
    // Uncomment after Testing
    // // Fallback static values
    //this.setFallbackAppointmentTypes();

    // const types: { [key: string]: string } = {
    //   'general-checkup': 'General Checkup',
    //   'follow-up': 'Follow-up Visit',
    //   'specialist': 'Specialist Consultation',
    //   'vaccination': 'Vaccination',
    //   'lab-test': 'Laboratory Test'
    // };
    //
    //  return this.appointmentTypes[typeCode] || typeCode;
  }

  getAppointmentTypes(){
    this.appointmentService.getAppointmentType().subscribe({
      next: (data: AppointmentType[])=> {
        console.log('Response',data); // DEBUG
        //this.appointmentTypes = data;

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

}
