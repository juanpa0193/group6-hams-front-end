export interface AppointmentFormModel {
  doctor_id: string;
  date: string;
  time: string;
  appointmentType: string;
  department?: string;
  reason?: string;
}

export interface ScheduledAppointmentModel {
  scheduledWith: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  reason?: string;
  status?: string;
}
