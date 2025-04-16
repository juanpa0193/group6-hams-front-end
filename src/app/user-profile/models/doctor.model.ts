export interface Doctor {
  firstName: string,
  lastName: string,
  phoneNumber: string | null,
  email: string | null,
  specialty: string | null,
  department: string | null,
  licenseNumber: string | null,
  biography: string | null,
  education: string | null,
  imageUrl: string | null,
  rating: number | null,
  reviewCount: number | null,
}
