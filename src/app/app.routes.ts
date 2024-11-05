import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./enrollment/enrollment-list.component').then(m => m.EnrollmentListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./enrollment/enrollment-form.component').then(m => m.EnrollmentFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./enrollment/enrollment-form.component').then(m => m.EnrollmentFormComponent)
  }
];