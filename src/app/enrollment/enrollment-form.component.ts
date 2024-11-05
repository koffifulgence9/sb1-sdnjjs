import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EnrollmentService } from '../services/enrollment.service';
import { Country, City } from '../models/enrollment.model';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-semibold mb-6">{{isEditing ? 'Modifier' : 'Nouvel'}} Enrôlement</h2>
      
      <form [formGroup]="enrollmentForm" (ngSubmit)="onSubmit()">
        <!-- Étape 1 -->
        <div *ngIf="currentStep === 1">
          <div class="mb-4">
            <label class="form-label">Matricule</label>
            <input type="text" [value]="matricule" readonly class="form-input bg-gray-100" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="form-label">Prénom</label>
              <input type="text" formControlName="firstName" class="form-input" />
              <span *ngIf="enrollmentForm.get('firstName')?.errors?.['required'] && enrollmentForm.get('firstName')?.touched" 
                    class="text-red-500 text-sm">
                Le prénom est requis
              </span>
            </div>
            
            <div class="mb-4">
              <label class="form-label">Nom</label>
              <input type="text" formControlName="lastName" class="form-input" />
              <span *ngIf="enrollmentForm.get('lastName')?.errors?.['required'] && enrollmentForm.get('lastName')?.touched" 
                    class="text-red-500 text-sm">
                Le nom est requis
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="form-label">Téléphone</label>
              <input type="tel" formControlName="phone" class="form-input" />
              <span *ngIf="enrollmentForm.get('phone')?.errors?.['required'] && enrollmentForm.get('phone')?.touched" 
                    class="text-red-500 text-sm">
                Le téléphone est requis
              </span>
              <span *ngIf="enrollmentForm.get('phone')?.errors?.['pattern'] && enrollmentForm.get('phone')?.touched" 
                    class="text-red-500 text-sm">
                Le numéro doit contenir exactement 10 chiffres
              </span>
            </div>
            
            <div class="mb-4">
              <label class="form-label">Email</label>
              <input type="email" formControlName="email" class="form-input" />
              <span *ngIf="enrollmentForm.get('email')?.errors?.['required'] && enrollmentForm.get('email')?.touched" 
                    class="text-red-500 text-sm">
                L'email est requis
              </span>
              <span *ngIf="enrollmentForm.get('email')?.errors?.['email'] && enrollmentForm.get('email')?.touched" 
                    class="text-red-500 text-sm">
                Format d'email invalide
              </span>
            </div>
          </div>
        </div>

        <!-- Reste du template inchangé -->
        <!-- Étapes 2 et 3 restent les mêmes -->

        <div class="flex justify-between mt-6">
          <button 
            *ngIf="currentStep > 1" 
            type="button" 
            (click)="previousStep()"
            class="btn btn-primary">
            Précédent
          </button>
          
          <button 
            *ngIf="currentStep < 3" 
            type="button" 
            (click)="nextStep()"
            [disabled]="!isStepValid(currentStep)"
            class="btn btn-primary ml-auto"
            [class.opacity-50]="!isStepValid(currentStep)">
            Suivant
          </button>
          
          <button 
            *ngIf="currentStep === 3" 
            type="submit"
            [disabled]="!enrollmentForm.valid"
            class="btn btn-primary ml-auto"
            [class.opacity-50]="!enrollmentForm.valid">
            {{isEditing ? 'Modifier' : 'Valider'}}
          </button>
        </div>
      </form>
    </div>
  `
})
export class EnrollmentFormComponent {
  enrollmentForm: FormGroup;
  currentStep = 1;
  matricule = '';
  countries: Country[] = [];
  cities: City[] = [];
  isEditing = false;
  editId?: number;

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.enrollmentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      profession: ['', Validators.required],
      position: ['', Validators.required],
      service: ['', Validators.required],
      direction: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      idNumber: ['', Validators.required]
    });

    this.countries = this.enrollmentService.getCountries();
    
    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.editId = +params['id'];
        this.loadEnrollment(this.editId);
      }
    });

    this.enrollmentForm.get('lastName')?.valueChanges.subscribe(lastName => {
      if (lastName && !this.isEditing) {
        this.matricule = this.enrollmentService.generateMatricule(lastName);
      }
    });
  }

  loadEnrollment(id: number): void {
    const enrollment = this.enrollmentService.getEnrollmentById(id);
    if (enrollment) {
      this.matricule = enrollment.matricule;
      this.enrollmentForm.patchValue(enrollment);
      this.onCountryChange();
    }
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      return this.enrollmentForm.get('firstName')?.valid &&
             this.enrollmentForm.get('lastName')?.valid &&
             this.enrollmentForm.get('phone')?.valid &&
             this.enrollmentForm.get('email')?.valid;
    }
    if (step === 2) {
      return this.enrollmentForm.get('profession')?.valid &&
             this.enrollmentForm.get('position')?.valid &&
             this.enrollmentForm.get('service')?.valid &&
             this.enrollmentForm.get('direction')?.valid &&
             this.enrollmentForm.get('country')?.valid &&
             this.enrollmentForm.get('city')?.valid;
    }
    return true;
  }

  // Reste des méthodes existantes...

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      const formValue = this.enrollmentForm.value;
      const enrollment = {
        id: this.isEditing ? this.editId! : Date.now(),
        matricule: this.matricule,
        ...formValue,
        enrollmentDate: this.isEditing ? undefined : new Date(),
        isActive: true
      };

      if (this.isEditing) {
        this.enrollmentService.updateEnrollment(enrollment);
      } else {
        this.enrollmentService.addEnrollment(enrollment);
      }
      this.router.navigate(['/']);
    }
  }
}