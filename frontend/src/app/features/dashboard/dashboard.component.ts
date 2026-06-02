import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        <header class="app-page__header app-page__header--left">
          <h1 class="app-page__title">Dashboard</h1>
          <p class="app-page__subtitle">Bienvenido, {{ user?.name }}</p>
        </header>

        <div class="app-grid">
          @if (user?.role === 'ESTUDIANTE' || user?.role === 'DOCENTE') {
            <a class="app-nav-card" routerLink="/dashboard/applications">
              <mat-icon>how_to_reg</mat-icon>
              <h3>Mis solicitudes</h3>
              <p>Consulta el estado de tus solicitudes de vinculación</p>
            </a>
            <a class="app-nav-card" routerLink="/dashboard/my-teams-student">
              <mat-icon>groups</mat-icon>
              <h3>Mis grupos</h3>
              <p>Consulta los grupos a los que perteneces y sus proyectos</p>
            </a>
            @if (user?.role === 'DOCENTE') {
              <a class="app-nav-card" routerLink="/dashboard/projects">
                <mat-icon>science</mat-icon>
                <h3>Proyectos</h3>
                <p>Consulta los proyectos de investigación</p>
              </a>
            }
          }

          @if (user?.role === 'COORDINADOR' || user?.role === 'ADMINISTRADOR') {
            <a class="app-nav-card" routerLink="/dashboard/my-teams">
              <mat-icon>groups</mat-icon>
              @if (user?.role === 'ADMINISTRADOR') {
                <h3>Grupos</h3>
                <p>Consulta y gestiona los grupos de investigación</p>
              } @else {
                <h3>Mis grupos</h3>
                <p>Gestiona tus grupos de investigación</p>
              }
            </a>
            <a class="app-nav-card" routerLink="/dashboard/projects">
              <mat-icon>science</mat-icon>
              <h3>Proyectos</h3>
              <p>Administra los proyectos de investigación</p>
            </a>
            @if (user?.role === 'ADMINISTRADOR') {
              <a class="app-nav-card" routerLink="/dashboard/product-types">
                <mat-icon>category</mat-icon>
                <h3>Tipos de producto</h3>
                <p>Gestiona los tipos de productos de investigación</p>
              </a>
              <a class="app-nav-card" routerLink="/dashboard/project-areas">
                <mat-icon>school</mat-icon>
                <h3>Proyectos curriculares</h3>
                <p>Gestiona los proyectos curriculares</p>
              </a>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class DashboardComponent implements OnInit {
  user: { name?: string; role?: string } | null = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.refreshUser();
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
    });
    setInterval(() => this.authService.refreshUser(), 5000);
  }
}
