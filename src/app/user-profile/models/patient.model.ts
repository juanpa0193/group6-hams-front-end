export interface Patient {
  firstName: string,
  lastName: string,
  phoneNumber: string | null,
  email: string | null,
  dateOfBirth: Date | null,
  bloodType: string | null,
  gender: string | null,
  address: string | null,
  emergencyContactName: string | null,
  emergencyContactRelationship: string | null,
  emergencyContactPhoneNumber: string | null
}
