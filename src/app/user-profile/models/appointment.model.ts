export interface AppointmentModel {
  doctor_id: string;
  date: string;
  time: string;
  appointmentType: string;
  department: string;
  reason?: string;
}
