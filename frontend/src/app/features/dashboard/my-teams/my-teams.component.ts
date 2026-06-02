import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationResponseDialogComponent } from '../../../shared/components/application-response-dialog/application-response-dialog.component';
import { TeamDialogComponent } from '../../../shared/components/team-dialog/team-dialog.component';

@Component({
  selector: 'app-my-teams',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        <a routerLink="/dashboard" class="app-back-link">
          <mat-icon>arrow_back</mat-icon>
          Volver al dashboard
        </a>
        <div class="app-page-header">
          @if (authService.hasRole('ADMINISTRADOR')) {
            <h1 class="app-page__title">Grupos de investigación</h1>
          } @else {
            <h1 class="app-page__title">Mis grupos de investigación</h1>
          }
          @if (authService.hasRole('ADMINISTRADOR') || authService.hasRole('COORDINADOR')) {
            <button mat-stroked-button class="auth-btn-pill auth-btn-pill--inline" (click)="createTeam()">
              <span class="auth-btn-pill__label"><mat-icon>add</mat-icon> Crear grupo</span>
            </button>
          }
        </div>

      @if (teams.length > 0) {
        <div class="app-grid teams-list">
          @for (team of teams; track team.investigationTeamId) {
            <article class="app-surface-card app-surface-card--static team-card">
              <header class="app-surface-card__header">
                <h2 class="app-surface-card__title">{{ team.name }}</h2>
                <p class="app-surface-card__subtitle">{{ team.areaName }}</p>
              </header>
              <div class="app-surface-card__body">
                <p>{{team.description}}</p>
                
                @if (authService.hasRole('ADMINISTRADOR')) {
                  <div class="coordinator-info">
                    <mat-icon>person</mat-icon>
                    @if (team.coordinatorName) {
                      <span><strong>Coordinador:</strong> {{team.coordinatorName}} ({{team.coordinatorEmail}})</span>
                    } @else {
                      <span><strong>Coordinador:</strong> <em>Sin asignar</em></span>
                    }
                  </div>
                }
                
                <mat-expansion-panel class="app-expansion-panel applications-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>inbox</mat-icon>
                      Solicitudes de Vinculación
                      @if (getPendingCount(team.investigationTeamId) > 0) {
                        <span class="badge">{{getPendingCount(team.investigationTeamId)}}</span>
                      }
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  
                  @if (teamApplications[team.investigationTeamId] && teamApplications[team.investigationTeamId].length > 0) {
                    <table mat-table [dataSource]="teamApplications[team.investigationTeamId]!" class="applications-table">
                      <ng-container matColumnDef="userName">
                        <th mat-header-cell *matHeaderCellDef>Nombre</th>
                        <td mat-cell *matCellDef="let app">{{app.userName}}</td>
                      </ng-container>

                      <ng-container matColumnDef="userRole">
                        <th mat-header-cell *matHeaderCellDef>Rol</th>
                        <td mat-cell *matCellDef="let app">
                          <mat-chip 
                            [class]="'role-' + (app.userRole || 'ESTUDIANTE').toLowerCase()"
                            [style.background-color]="getRoleColor(app.userRole || 'ESTUDIANTE')"
                            [style.color]="'white'">
                            {{getRoleLabel(app.userRole || 'ESTUDIANTE')}}
                          </mat-chip>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="userEmail">
                        <th mat-header-cell *matHeaderCellDef>Email</th>
                        <td mat-cell *matCellDef="let app">{{app.userEmail}}</td>
                      </ng-container>

                      <ng-container matColumnDef="applicationDate">
                        <th mat-header-cell *matHeaderCellDef>Fecha</th>
                        <td mat-cell *matCellDef="let app">{{app.applicationDate | date:'short'}}</td>
                      </ng-container>

                      <ng-container matColumnDef="state">
                        <th mat-header-cell *matHeaderCellDef>Estado</th>
                        <td mat-cell *matCellDef="let app">
                          <mat-chip [class]="'app-chip app-chip--' + app.state.toLowerCase()">
                            {{getStateLabel(app.state)}}
                          </mat-chip>
                        </td>
                      </ng-container>

                      <ng-container matColumnDef="message">
                        <th mat-header-cell *matHeaderCellDef>Mensaje</th>
                        <td mat-cell *matCellDef="let app">{{app.applicationMessage}}</td>
                      </ng-container>

                      <ng-container matColumnDef="actions">
                        <th mat-header-cell *matHeaderCellDef>Acciones</th>
                        <td mat-cell *matCellDef="let app">
                          @if (!authService.hasRole('ADMINISTRADOR')) {
                            @if (app.state === 'PENDIENTE') {
                              <button mat-button color="primary" (click)="respondApplication(app, 'APROBADA')">
                                <mat-icon>check</mat-icon>
                                Aprobar
                              </button>
                              <button mat-button color="warn" (click)="respondApplication(app, 'RECHAZADA')">
                                <mat-icon>close</mat-icon>
                                Rechazar
                              </button>
                            } @else {
                              <span class="answer-info">
                                @if (app.answerMessage) {
                                  <mat-icon>info</mat-icon>
                                  Respondido: {{app.answerMessage}}
                                }
                              </span>
                            }
                          } @else {
                            <span class="answer-info">
                              @if (app.answerMessage) {
                                <mat-icon>info</mat-icon>
                                Respondido: {{app.answerMessage}}
                              } @else {
                                <span class="no-answer">Solo lectura</span>
                              }
                            </span>
                          }
                        </td>
                      </ng-container>

                      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                    </table>
                  } @else {
                    <p class="no-applications">No hay solicitudes para este equipo</p>
                  }
                </mat-expansion-panel>
              </div>
              <div class="app-surface-card__actions team-card-actions">
                <button mat-stroked-button class="auth-btn-pill auth-btn-pill--inline" [routerLink]="['/teams', team.investigationTeamId]">
                  <span class="auth-btn-pill__label"><mat-icon>arrow_forward</mat-icon> Ver detalles</span>
                </button>
                <button mat-stroked-button class="auth-btn-pill auth-btn-pill--inline" (click)="editTeam(team)">
                  <span class="auth-btn-pill__label"><mat-icon>edit</mat-icon> Editar</span>
                </button>
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="app-empty-state app-empty-state--compact">
          <mat-icon>groups</mat-icon>
          @if (authService.hasRole('ADMINISTRADOR')) {
            <p>No hay grupos registrados</p>
          } @else {
            <p>No tienes grupos registrados</p>
          }
        </div>
      }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .teams-list { grid-template-columns: 1fr; }
    .team-card-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .applications-panel mat-panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      background: #fffbeb;
      color: #92400e;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .applications-table { width: 100%; margin-top: 12px; }
    .coordinator-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: var(--auth-text-muted);
      margin-bottom: 12px;
    }
    .no-applications { text-align: center; padding: 16px; color: var(--auth-text-muted); }
    .answer-info, .no-answer { font-size: 0.875rem; color: var(--auth-text-muted); }
    .coordinator-info mat-icon { color: var(--navy-800); }
  `]
})
export class MyTeamsComponent implements OnInit {
  teams: any[] = [];
  teamApplications: { [key: number]: any[] } = {};
  displayedColumns: string[] = ['userName', 'userRole', 'userEmail', 'applicationDate', 'state', 'message', 'actions'];
  loading = false;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    console.log('MyTeamsComponent - Loading teams...');
    // Si es administrador, cargar todos los grupos; si no, cargar solo los que coordina
    const teamsObservable = this.authService.hasRole('ADMINISTRADOR') 
      ? this.apiService.getTeams() 
      : this.apiService.getMyTeams();
    
    teamsObservable.subscribe({
      next: (teams: any[]) => {
        console.log('MyTeamsComponent - Teams received:', teams);
        console.log('MyTeamsComponent - Teams count:', teams.length);
        this.teams = teams || [];
        
        // Cargar solicitudes para cada equipo (solo si no es administrador o si el equipo tiene coordinador)
        teams.forEach((team: any) => {
          // Los administradores pueden ver las solicitudes pero no responderlas
          if (!this.authService.hasRole('ADMINISTRADOR') || team.coordinatorId) {
            this.loadApplicationsForTeam(team.investigationTeamId);
          }
        });
      },
      error: (error: any) => {
        console.error('MyTeamsComponent - Error loading teams:', error);
        console.error('MyTeamsComponent - Error status:', error.status);
        console.error('MyTeamsComponent - Error message:', error.message);
        this.teams = [];
      }
    });
  }

  loadApplicationsForTeam(teamId: number): void {
    this.apiService.getApplicationsByTeam(teamId).subscribe({
      next: (applications) => {
        this.teamApplications[teamId] = applications;
      },
      error: (error) => {
        console.error('Error loading applications for team:', error);
        this.teamApplications[teamId] = [];
      }
    });
  }

  getPendingCount(teamId: number): number {
    const apps = this.teamApplications[teamId] || [];
    return apps.filter(app => app.state === 'PENDIENTE').length;
  }

  getStateLabel(state: string): string {
    const labels: { [key: string]: string } = {
      'PENDIENTE': 'Pendiente',
      'APROBADA': 'Aprobada',
      'RECHAZADA': 'Rechazada'
    };
    return labels[state] || state;
  }

  getRoleLabel(role: string): string {
    const labels: { [key: string]: string } = {
      'ESTUDIANTE': 'Estudiante',
      'DOCENTE': 'Docente',
      'COORDINADOR': 'Coordinador',
      'ADMINISTRADOR': 'Administrador'
    };
    return labels[role] || role;
  }

  getRoleColor(role: string): string {
    const colors: { [key: string]: string } = {
      'ESTUDIANTE': '#4caf50',
      'DOCENTE': '#2196f3',
      'COORDINADOR': '#ff9800',
      'ADMINISTRADOR': '#9c27b0'
    };
    return colors[role] || '#757575';
  }

  respondApplication(application: any, newState: string): void {
    const dialogRef = this.dialog.open(ApplicationResponseDialogComponent, {
      width: '500px',
      data: { 
        application, 
        state: newState 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateApplicationStatus(
          application.applicationId, 
          newState, 
          result.message
        ).subscribe({
          next: () => {
            this.snackBar.open(
              `Solicitud ${newState === 'APROBADA' ? 'aprobada' : 'rechazada'} exitosamente`, 
              'Cerrar', 
              { duration: 3000 }
            );
            // Recargar solicitudes del equipo
            this.loadApplicationsForTeam(application.investigationTeamId);
          },
          error: (error) => {
            console.error('Error updating application:', error);
            this.snackBar.open('Error al actualizar la solicitud', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  createTeam(): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.createTeam(result).subscribe({
          next: () => {
            this.snackBar.open('Grupo creado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadTeams(); // Recargar la lista
            // Refrescar el usuario por si cambió su rol (si el admin asignó un docente como coordinador)
            // Delay para asegurar que el backend haya procesado el cambio
            setTimeout(() => {
              this.authService.refreshUser();
            }, 1000);
          },
          error: (error) => {
            console.error('Error creating team:', error);
            const errorMessage = error.error?.message || 'Error al crear el grupo';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }

  editTeam(team: any): void {
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '600px',
      data: { team }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.apiService.updateTeam(team.investigationTeamId, result).subscribe({
          next: () => {
            this.snackBar.open('Grupo actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.loading = false;
            this.loadTeams(); // Recargar la lista
            // Refrescar el usuario por si cambió su rol
            // Delay para asegurar que el backend haya procesado el cambio
            setTimeout(() => {
              this.authService.refreshUser();
            }, 1000);
          },
          error: (error) => {
            console.error('Error updating team:', error);
            const errorMessage = error.error?.message || 'Error al actualizar el grupo';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        });
      }
    });
  }
}

