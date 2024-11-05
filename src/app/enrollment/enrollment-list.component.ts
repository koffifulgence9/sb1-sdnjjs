import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Liste des Enrôlements</h2>
        <a routerLink="/new" class="btn btn-primary">
          Nouvel Enrôlement
        </a>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matricule</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Complet</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'Enrôlement</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let enrollment of enrollments">
              <td class="px-6 py-4 whitespace-nowrap">{{enrollment.matricule}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{enrollment.firstName}} {{enrollment.lastName}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{enrollment.enrollmentDate | date:'dd/MM/yyyy'}}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    [checked]="enrollment.isActive"
                    (change)="openStatusModal(enrollment)"
                    class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </td>
              <td class="px-6 py-4 whitespace-nowrap space-x-3">
                <a [routerLink]="['/edit', enrollment.id]" 
                   class="text-blue-600 hover:text-blue-900">
                  Modifier
                </a>
                <button 
                  (click)="openDeleteModal(enrollment)"
                  class="text-red-600 hover:text-red-900">
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <h3 class="text-lg font-medium mb-4">Confirmation de suppression</h3>
        <p class="mb-4">Voulez-vous vraiment supprimer le matricule {{selectedEnrollment?.matricule}} ?</p>
        <div class="flex justify-end space-x-4">
          <button 
            (click)="cancelDelete()"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Non
          </button>
          <button 
            (click)="confirmDelete()"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Oui
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de changement de statut -->
    <div *ngIf="showStatusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <h3 class="text-lg font-medium mb-4">Confirmation de changement de statut</h3>
        <p class="mb-4">
          Voulez-vous vraiment {{selectedEnrollment?.isActive ? 'désactiver' : 'activer'}} 
          le matricule {{selectedEnrollment?.matricule}} ?
        </p>
        <div class="flex justify-end space-x-4">
          <button 
            (click)="cancelStatusChange()"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Non
          </button>
          <button 
            (click)="confirmStatusChange()"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Oui
          </button>
        </div>
      </div>
    </div>
  `
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  showDeleteModal = false;
  showStatusModal = false;
  selectedEnrollment: Enrollment | null = null;

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.enrollmentService.getEnrollments().subscribe(
      enrollments => this.enrollments = enrollments
    );
  }

  openStatusModal(enrollment: Enrollment): void {
    this.selectedEnrollment = enrollment;
    this.showStatusModal = true;
  }

  cancelStatusChange(): void {
    if (this.selectedEnrollment) {
      this.selectedEnrollment.isActive = !this.selectedEnrollment.isActive; // Revert the checkbox
    }
    this.showStatusModal = false;
    this.selectedEnrollment = null;
  }

  confirmStatusChange(): void {
    if (this.selectedEnrollment) {
      this.enrollmentService.toggleStatus(this.selectedEnrollment.id);
      this.showStatusModal = false;
      this.selectedEnrollment = null;
    }
  }

  // Méthodes existantes pour la suppression...
}