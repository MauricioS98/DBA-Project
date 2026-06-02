import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-my-teams-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule
  ],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        <a routerLink="/dashboard" class="app-back-link">
          <mat-icon>arrow_back</mat-icon>
          Volver al dashboard
        </a>
        <header class="app-page__header app-page__header--left">
          <h1 class="app-page__title">Mis grupos de investigación</h1>
        </header>

      @if (loading) {
        <div class="app-empty-state app-empty-state--compact">
          <mat-icon>hourglass_empty</mat-icon>
          <p>Cargando grupos...</p>
        </div>
      } @else if (teams.length > 0) {
        <div class="app-grid teams-list">
          @for (team of teams; track team.investigationTeamId) {
            <article class="app-surface-card app-surface-card--static">
              <header class="app-surface-card__header">
                <h2 class="app-surface-card__title">{{ team.name }}</h2>
                <p class="app-surface-card__subtitle">{{ team.areaName }}</p>
              </header>
              <div class="app-surface-card__body">
                <p class="description">{{team.description}}</p>
                <div class="team-meta">
                  <span><mat-icon>email</mat-icon> {{team.teamEmail}}</span>
                  @if (team.coordinatorName) {
                    <span><mat-icon>person</mat-icon> Coordinador: {{team.coordinatorName}}</span>
                  }
                </div>

                <mat-expansion-panel class="app-expansion-panel projects-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>science</mat-icon>
                      Proyectos de Investigación
                      @if (teamProjects[team.investigationTeamId] && teamProjects[team.investigationTeamId].length > 0) {
                        <mat-chip class="count-chip">{{teamProjects[team.investigationTeamId].length}}</mat-chip>
                      }
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  @if (teamProjects[team.investigationTeamId] && teamProjects[team.investigationTeamId].length > 0) {
                    <div class="projects-grid">
                      @for (project of teamProjects[team.investigationTeamId]; track project.investigationProjectId) {
                        <article class="app-surface-card app-surface-card--static project-card">
                          <header class="app-surface-card__header">
                            <h3 class="app-surface-card__title">{{ project.title }}</h3>
                            <p class="app-surface-card__subtitle">{{ getStateLabel(project.state) }}</p>
                          </header>
                          <div class="app-surface-card__body">
                            <p class="app-surface-card__text">{{ project.resume }}</p>
                            @if (project.document && project.document.trim() !== '') {
                              <a [href]="project.document" target="_blank" rel="noopener noreferrer" class="app-link">
                                <mat-icon>link</mat-icon>
                                Ver documento
                              </a>
                            }
                          </div>
                        </article>
                      }
                    </div>
                  } @else {
                    <p class="no-projects">No hay proyectos registrados para este grupo</p>
                  }
                </mat-expansion-panel>
              </div>
              <div class="app-surface-card__actions">
                <button mat-stroked-button class="auth-btn-pill auth-btn-pill--inline" [routerLink]="['/teams', team.investigationTeamId]">
                  <span class="auth-btn-pill__label"><mat-icon>arrow_forward</mat-icon> Ver detalles</span>
                </button>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="app-empty-state app-empty-state--compact">
          <mat-icon>groups</mat-icon>
          <p>No perteneces a ningún grupo de investigación</p>
        </div>
      }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .teams-list { grid-template-columns: 1fr; }
    .description { margin-bottom: 12px; color: var(--auth-text-muted); line-height: 1.55; }
    .team-meta { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; font-size: 0.875rem; color: var(--auth-text-muted); }
    .team-meta span { display: flex; align-items: center; gap: 6px; }
    .projects-panel mat-panel-title { display: flex; align-items: center; gap: 8px; }
    .count-chip { font-size: 0.75rem !important; min-height: 24px !important; }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; margin-top: 12px; }
    .no-projects { text-align: center; padding: 16px; color: var(--auth-text-muted); }
  `]
})
export class MyTeamsStudentComponent implements OnInit {
  teams: any[] = [];
  teamProjects: { [key: number]: any[] } = {};
  loading = false;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.loading = true;
    this.apiService.getMyTeamsAsStudent().subscribe({
      next: (teams: any[]) => {
        this.teams = teams || [];
        this.loading = false;
        // Cargar proyectos para cada equipo
        teams.forEach((team: any) => {
          this.loadProjectsForTeam(team.investigationTeamId);
        });
      },
      error: (error: any) => {
        console.error('Error loading teams:', error);
        this.teams = [];
        this.loading = false;
      }
    });
  }

  loadProjectsForTeam(teamId: number): void {
    this.apiService.getProjectsByTeam(teamId).subscribe({
      next: (projects) => {
        console.log('Projects loaded for team', teamId, ':', projects);
        projects.forEach((p: any) => {
          console.log('Project:', p.title, 'document:', p.document);
        });
        this.teamProjects[teamId] = projects || [];
      },
      error: (error) => {
        console.error('Error loading projects for team:', error);
        this.teamProjects[teamId] = [];
      }
    });
  }

  getStateLabel(state: number): string {
    const states: { [key: number]: string } = {
      1: 'Activo',
      2: 'En desarrollo',
      3: 'Finalizado',
      4: 'Cancelado'
    };
    return states[state] || 'Desconocido';
  }

  getStateClass(state: number): string {
    return state.toString();
  }
}

