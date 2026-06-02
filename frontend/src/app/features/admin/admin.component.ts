import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        <header class="app-page__header app-page__header--left">
          <h1 class="app-page__title">Panel de administración</h1>
          <p class="app-page__subtitle">Herramientas de gestión del sistema</p>
        </header>

        <div class="app-grid">
          <a class="app-nav-card" routerLink="/admin/users">
            <mat-icon>people</mat-icon>
            <h3>Gestión de usuarios</h3>
            <p>Administra usuarios y roles del sistema</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class AdminComponent {}
