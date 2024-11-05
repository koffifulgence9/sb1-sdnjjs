export interface Enrollment {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profession: string;
  position: string;
  service: string;
  direction: string;
  city: string;
  country: string;
  idNumber: string;
  enrollmentDate: Date;
  isActive: boolean;
}

export interface Country {
  code: string;
  name: string;
}

export interface City {
  id: number;
  name: string;
  countryCode: string;
}