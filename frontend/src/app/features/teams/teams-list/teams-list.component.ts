import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        <header class="app-page__header">
          <h1 class="app-page__title">Grupos de Investigación</h1>
          <p class="app-page__subtitle">
            Explora los grupos de investigación de la Facultad de Ingeniería
          </p>
        </header>

        <div class="app-toolbar-card">
          <mat-form-field appearance="outline" class="auth-field search-field" subscriptSizing="dynamic">
            <input
              matInput
              [(ngModel)]="searchTerm"
              (ngModelChange)="filterTeams()"
              placeholder="Buscar grupos..."
            />
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="auth-field filter-field" subscriptSizing="dynamic">
            <mat-select
              [(ngModel)]="selectedAreaId"
              (selectionChange)="filterTeams()"
              placeholder="Filtrar por área"
              panelClass="auth-select-panel"
            >
              <mat-option [value]="null">Todas las áreas</mat-option>
              @for (area of investigationAreas; track area.investigationAreaId) {
                <mat-option [value]="area.investigationAreaId">{{ area.name }}</mat-option>
              }
            </mat-select>
            <mat-icon matPrefix>filter_list</mat-icon>
          </mat-form-field>
        </div>

        <div class="app-grid">
          @for (team of filteredTeams; track team.investigationTeamId) {
            <article class="app-surface-card">
              <header class="app-surface-card__header">
                <h2 class="app-surface-card__title">{{ team.name }}</h2>
                <p class="app-surface-card__subtitle">{{ team.areaName }}</p>
              </header>
              <div class="app-surface-card__body">
                <p class="app-surface-card__text">{{ team.description }}</p>
                <div class="app-surface-card__meta">
                  <span><mat-icon>mail_outline</mat-icon> {{ team.teamEmail }}</span>
                  @if (team.projectAreaName) {
                    <span><mat-icon>school</mat-icon> {{ team.projectAreaName }}</span>
                  }
                  @if (team.coordinatorName) {
                    <span><mat-icon>person_outline</mat-icon> {{ team.coordinatorName }}</span>
                  }
                </div>
              </div>
              <div class="app-surface-card__actions">
                <button
                  mat-stroked-button
                  class="auth-btn-pill auth-btn-pill--inline"
                  [routerLink]="['/teams', team.investigationTeamId]"
                >
                  <span class="auth-btn-pill__label">
                    <mat-icon aria-hidden="true">arrow_forward</mat-icon>
                    Ver detalles
                  </span>
                </button>
              </div>
            </article>
          } @empty {
            <div class="app-empty-state">
              <mat-icon>groups</mat-icon>
              <p>No se encontraron grupos de investigación</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class TeamsListComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  investigationAreas: any[] = [];
  searchTerm = '';
  selectedAreaId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTeams();
    this.loadInvestigationAreas();
  }

  loadTeams(): void {
    this.apiService.getTeams().subscribe({
      next: (teams) => {
        this.teams = teams;
        this.filteredTeams = teams;
      },
      error: (error) => console.error('Error loading teams:', error)
    });
  }

  loadInvestigationAreas(): void {
    this.apiService.getInvestigationAreas().subscribe({
      next: (areas) => {
        this.investigationAreas = areas;
      },
      error: (error) => console.error('Error loading areas:', error)
    });
  }

  filterTeams(): void {
    this.filteredTeams = this.teams.filter((team) => {
      const matchesSearch =
        !this.searchTerm ||
        team.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        team.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesArea = !this.selectedAreaId || team.areaId === this.selectedAreaId;

      return matchesSearch && matchesArea;
    });
  }
}
