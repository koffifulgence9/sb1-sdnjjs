import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-3">
          <h1 class="text-xl font-semibold text-gray-800">Système d'Enrôlement</h1>
        </div>
      </nav>
      <main class="max-w-7xl mx-auto px-4 py-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}