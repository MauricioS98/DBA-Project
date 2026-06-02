import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationDialogComponent } from '../../../shared/components/application-dialog/application-dialog.component';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        @if (loading) {
          <div class="app-empty-state">
            <mat-icon>hourglass_empty</mat-icon>
            <p>Cargando grupo...</p>
          </div>
        } @else if (team) {
          <a routerLink="/teams" class="back-link">
            <mat-icon>arrow_back</mat-icon>
            Volver a grupos
          </a>

          <article class="app-surface-card team-detail-hero">
            <header class="app-surface-card__header">
              <h1 class="app-page__title team-detail-hero__title">{{ team.name }}</h1>
              <p class="app-surface-card__subtitle">{{ team.areaName }}</p>
            </header>
            <div class="app-surface-card__body">
              <p class="team-detail-hero__description">{{ team.description }}</p>
              <div class="app-surface-card__meta">
                <span><mat-icon>mail_outline</mat-icon> {{ team.teamEmail }}</span>
                @if (team.projectAreaName) {
                  <span><mat-icon>school</mat-icon> {{ team.projectAreaName }}</span>
                }
                @if (team.coordinatorName) {
                  <span><mat-icon>person_outline</mat-icon> Coordinador: {{ team.coordinatorName }}</span>
                }
              </div>

              @if (authService.isAuthenticated() && (authService.hasRole('ESTUDIANTE') || authService.hasRole('DOCENTE'))) {
                @if (applicationStatus === 'none' || applicationStatus === 'rejected') {
                  <button mat-stroked-button class="auth-btn-pill auth-btn-pill--inline" (click)="openApplicationDialog()">
                    <span class="auth-btn-pill__label">
                      <mat-icon>how_to_reg</mat-icon>
                      Solicitar vinculación
                    </span>
                  </button>
                } @else if (applicationStatus === 'pending') {
                  <div class="app-status-badge app-status-badge--pending">
                    <mat-icon>hourglass_empty</mat-icon>
                    Solicitud pendiente de revisión
                  </div>
                } @else if (applicationStatus === 'approved') {
                  <div class="app-status-badge app-status-badge--approved">
                    <mat-icon>check_circle</mat-icon>
                    Ya estás inscrito en este grupo
                  </div>
                }
              }
            </div>
          </article>

          <section class="team-projects">
            <h2 class="app-section-title">Proyectos de investigación</h2>
            @if (projects && projects.length > 0) {
              <div class="app-grid">
                @for (project of projects; track project.investigationProjectId) {
                  <article class="app-surface-card">
                    <header class="app-surface-card__header">
                      <h3 class="app-surface-card__title">{{ project.title }}</h3>
                      <p class="app-surface-card__subtitle">{{ getStateLabel(project.state) }}</p>
                    </header>
                    <div class="app-surface-card__body">
                      <p class="app-surface-card__text">{{ project.resume }}</p>
                      @if (project.document && project.document.trim() !== '') {
                        <a
                          [href]="project.document"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="app-link"
                        >
                          <mat-icon>link</mat-icon>
                          Ver documento
                        </a>
                      }
                    </div>
                  </article>
                }
              </div>
            } @else {
              <div class="app-empty-state app-empty-state--compact">
                <mat-icon>folder_open</mat-icon>
                <p>No hay proyectos registrados</p>
              </div>
            }
          </section>
        } @else {
          <div class="app-empty-state">
            <mat-icon>error_outline</mat-icon>
            <p>Grupo no encontrado</p>
            <a routerLink="/teams" class="auth-card__link">Volver al listado</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 20px;
      color: var(--auth-text-muted);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      font-family: var(--font-sans);
    }

    .back-link:hover {
      color: var(--auth-primary);
    }

    .back-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .team-detail-hero {
      margin-bottom: 36px;
    }

    .team-detail-hero:hover {
      transform: none;
    }

    .team-detail-hero__title {
      text-align: left;
      font-size: 1.5rem;
    }

    .team-detail-hero__description {
      margin: 0 0 16px;
      font-size: 1rem;
      line-height: 1.6;
      color: var(--auth-text-muted);
    }

    .team-projects {
      margin-top: 8px;
    }

    .app-empty-state--compact {
      padding: 32px 24px;
    }
  `]
})
export class TeamDetailComponent implements OnInit {
  team: any = null;
  projects: any[] = [];
  loading = true;
  applicationStatus: 'none' | 'pending' | 'approved' | 'rejected' = 'none';
  existingApplication: any = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.loadTeam(Number(teamId));
      this.loadProjects(Number(teamId));

      if (
        this.authService.isAuthenticated() &&
        (this.authService.hasRole('ESTUDIANTE') || this.authService.hasRole('DOCENTE'))
      ) {
        this.authService.currentUser$.subscribe((user) => {
          if (user) {
            this.checkExistingApplication(Number(teamId));
          }
        });
      }
    }
  }

  loadTeam(id: number): void {
    this.apiService.getTeamById(id).subscribe({
      next: (team) => {
        this.team = team;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading team:', error);
        this.loading = false;
      }
    });
  }

  checkExistingApplication(teamId: number): void {
    this.apiService.getMyApplicationByTeam(teamId).subscribe({
      next: (application) => {
        if (application) {
          this.existingApplication = application;
          if (application.state === 'APROBADA') {
            this.applicationStatus = 'approved';
          } else if (application.state === 'PENDIENTE') {
            this.applicationStatus = 'pending';
          } else if (application.state === 'RECHAZADA') {
            this.applicationStatus = 'rejected';
          }
        } else {
          this.applicationStatus = 'none';
        }
      },
      error: () => {
        this.applicationStatus = 'none';
      }
    });
  }

  loadProjects(teamId: number): void {
    this.apiService.getProjectsByTeam(teamId).subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => console.error('Error loading projects:', error)
    });
  }

  getStateLabel(state: number): string {
    const states: Record<number, string> = {
      0: 'En planificación',
      1: 'Activo',
      2: 'En desarrollo',
      3: 'Finalizado',
      4: 'Cancelado'
    };
    return states[state] ?? 'Desconocido';
  }

  openApplicationDialog(): void {
    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
      width: '500px',
      data: { teamId: this.team.investigationTeamId, teamName: this.team.name }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.checkExistingApplication(this.team.investigationTeamId);
      }
    });
  }
}
