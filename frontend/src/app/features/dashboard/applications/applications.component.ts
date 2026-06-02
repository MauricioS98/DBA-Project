import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatChipsModule, MatIconModule],
  template: `
    <div class="app-page">
      <div class="app-page__inner">
        <a routerLink="/dashboard" class="app-back-link">
          <mat-icon>arrow_back</mat-icon>
          Volver al dashboard
        </a>

        <header class="app-page__header app-page__header--left">
          <h1 class="app-page__title">Mis solicitudes de vinculación</h1>
        </header>

        @if (applications.length > 0) {
          <div class="app-table-card">
            <table mat-table [dataSource]="applications">
              <ng-container matColumnDef="teamName">
                <th mat-header-cell *matHeaderCellDef>Grupo</th>
                <td mat-cell *matCellDef="let application">{{ application.teamName }}</td>
              </ng-container>
              <ng-container matColumnDef="applicationDate">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let application">{{ application.applicationDate | date: 'short' }}</td>
              </ng-container>
              <ng-container matColumnDef="state">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let application">
                  <mat-chip [class]="'app-chip app-chip--' + application.state.toLowerCase()">
                    {{ getStateLabel(application.state) }}
                  </mat-chip>
                </td>
              </ng-container>
              <ng-container matColumnDef="message">
                <th mat-header-cell *matHeaderCellDef>Mi mensaje</th>
                <td mat-cell *matCellDef="let application">{{ application.applicationMessage }}</td>
              </ng-container>
              <ng-container matColumnDef="answerDate">
                <th mat-header-cell *matHeaderCellDef>Respuesta</th>
                <td mat-cell *matCellDef="let application">
                  @if (application.answerDate) {
                    {{ application.answerDate | date: 'short' }}
                  } @else {
                    <span class="app-text-muted">—</span>
                  }
                </td>
              </ng-container>
              <ng-container matColumnDef="answerMessage">
                <th mat-header-cell *matHeaderCellDef>Mensaje del coordinador</th>
                <td mat-cell *matCellDef="let application">
                  @if (application.answerMessage) {
                    <div class="app-answer-box">
                      <mat-icon>reply</mat-icon>
                      {{ application.answerMessage }}
                    </div>
                  } @else {
                    <span class="app-text-muted">Pendiente de respuesta</span>
                  }
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        } @else {
          <div class="app-empty-state app-empty-state--compact">
            <mat-icon>inbox</mat-icon>
            <p>No tienes solicitudes de vinculación</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; }`]
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];
  displayedColumns: string[] = ['teamName', 'applicationDate', 'state', 'message', 'answerDate', 'answerMessage'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.getMyApplications().subscribe({
      next: (applications) => {
        this.applications = applications;
      },
      error: (error) => console.error('Error loading applications:', error)
    });
  }

  getStateLabel(state: string): string {
    const labels: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      APROBADA: 'Aprobada',
      RECHAZADA: 'Rechazada'
    };
    return labels[state] || state;
  }
}
