import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Enrollment, Country, City } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private enrollments = new BehaviorSubject<Enrollment[]>([]);

  private countries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'SN', name: 'Sénégal' },
    // Ajoutez d'autres pays selon vos besoins
  ];

  private cities: City[] = [
    { id: 1, name: 'Paris', countryCode: 'FR' },
    { id: 2, name: 'Dakar', countryCode: 'SN' },
    // Ajoutez d'autres villes selon vos besoins
  ];

  getEnrollments(): Observable<Enrollment[]> {
    return this.enrollments.asObservable();
  }

  getEnrollmentById(id: number): Enrollment | undefined {
    return this.enrollments.value.find(e => e.id === id);
  }

  generateMatricule(lastName: string): string {
    const numbers = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const namePrefix = lastName.slice(0, 3).toUpperCase();
    return numbers + namePrefix;
  }

  addEnrollment(enrollment: Enrollment): void {
    const currentEnrollments = this.enrollments.value;
    this.enrollments.next([...currentEnrollments, enrollment]);
  }

  updateEnrollment(enrollment: Enrollment): void {
    const currentEnrollments = this.enrollments.value;
    const index = currentEnrollments.findIndex(e => e.id === enrollment.id);
    if (index !== -1) {
      currentEnrollments[index] = { ...currentEnrollments[index], ...enrollment };
      this.enrollments.next([...currentEnrollments]);
    }
  }

  deleteEnrollment(id: number): void {
    const currentEnrollments = this.enrollments.value;
    this.enrollments.next(currentEnrollments.filter(e => e.id !== id));
  }

  toggleStatus(id: number): void {
    const currentEnrollments = this.enrollments.value;
    const enrollment = currentEnrollments.find(e => e.id === id);
    if (enrollment) {
      enrollment.isActive = !enrollment.isActive;
      this.enrollments.next([...currentEnrollments]);
    }
  }

  getCountries(): Country[] {
    return this.countries;
  }

  getCitiesByCountry(countryCode: string): City[] {
    return this.cities.filter(city => city.countryCode === countryCode);
  }
}