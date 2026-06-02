import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="header-toolbar" [class.header-toolbar--auth]="isAuthRoute">
      <button mat-icon-button class="menu-button" (click)="sidenav.toggle()" aria-label="Menú">
        <mat-icon>menu</mat-icon>
      </button>

      <a routerLink="/home" class="logo">
        <mat-icon class="logo-icon" aria-hidden="true">school</mat-icon>
        <span class="logo-text">Investigación UD</span>
      </a>

      <span class="spacer"></span>

      <nav class="nav-links desktop-nav" aria-label="Navegación principal">
        <a mat-button routerLink="/home" routerLinkActive="active">Inicio</a>
        <a mat-button routerLink="/teams" routerLinkActive="active">Grupos</a>

        @if (authService.isAuthenticated()) {
          <a mat-button routerLink="/dashboard" routerLinkActive="active">Dashboard</a>

          @if (authService.hasRole('ADMINISTRADOR')) {
            <a mat-button routerLink="/admin" routerLinkActive="active">Administración</a>
          }

          <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-trigger">
            <mat-icon>account_circle</mat-icon>
            <span class="user-name">{{ authService.getCurrentUser()?.name }}</span>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Cerrar Sesión</span>
            </button>
          </mat-menu>
        } @else {
          @if (isRegisterRoute) {
            <a mat-stroked-button routerLink="/login" class="btn-auth-outline">Iniciar Sesión</a>
            <a mat-button routerLink="/register" routerLinkActive="active" class="nav-link-auth-active">Registrarse</a>
          } @else {
            <a mat-button routerLink="/login" routerLinkActive="active" class="nav-link-auth-active">Iniciar Sesión</a>
            <a mat-stroked-button routerLink="/register" class="btn-auth-outline">Registrarse</a>
          }
        }
      </nav>
    </mat-toolbar>

    <mat-sidenav-container class="sidenav-container mobile-only">
      <mat-sidenav #sidenav mode="over" class="mobile-sidenav">
        <mat-nav-list>
          <a mat-list-item routerLink="/home" routerLinkActive="active" (click)="sidenav.close()">
            <mat-icon matListItemIcon>home</mat-icon>
            <span matListItemTitle>Inicio</span>
          </a>
          <a mat-list-item routerLink="/teams" routerLinkActive="active" (click)="sidenav.close()">
            <mat-icon matListItemIcon>groups</mat-icon>
            <span matListItemTitle>Grupos</span>
          </a>

          @if (authService.isAuthenticated()) {
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="sidenav.close()">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>Dashboard</span>
            </a>

            @if (authService.hasRole('ADMINISTRADOR')) {
              <a mat-list-item routerLink="/admin" routerLinkActive="active" (click)="sidenav.close()">
                <mat-icon matListItemIcon>admin_panel_settings</mat-icon>
                <span matListItemTitle>Administración</span>
              </a>
            }

            <mat-divider></mat-divider>
            <div class="mobile-user-info">
              <mat-icon>account_circle</mat-icon>
              <span>{{ authService.getCurrentUser()?.name }}</span>
            </div>
            <button mat-list-item (click)="logout(); sidenav.close()">
              <mat-icon matListItemIcon>logout</mat-icon>
              <span matListItemTitle>Cerrar Sesión</span>
            </button>
          } @else {
            <mat-divider></mat-divider>
            <a mat-list-item routerLink="/login" (click)="sidenav.close()">
              <mat-icon matListItemIcon>login</mat-icon>
              <span matListItemTitle>Iniciar Sesión</span>
            </a>
            <a mat-list-item routerLink="/register" (click)="sidenav.close()">
              <mat-icon matListItemIcon>person_add</mat-icon>
              <span matListItemTitle>Registrarse</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content></mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .header-toolbar {
      background: linear-gradient(180deg, var(--navy-800) 0%, var(--navy-900) 100%) !important;
      color: var(--primary-white);
      padding: 0 clamp(16px, 4vw, 40px);
      box-shadow: 0 2px 12px rgba(8, 38, 54, 0.25);
      height: 72px;
      position: relative;
      z-index: 1000;
      font-family: var(--font-sans);
    }

    .menu-button {
      display: none;
      margin-right: 8px;
      color: var(--primary-white);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--primary-white);
      text-decoration: none;
      padding: 8px 0;
    }

    .logo-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      opacity: 0.95;
    }

    .logo-text {
      font-size: 1.125rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-links a[mat-button],
    .nav-links button[mat-button] {
      color: rgba(255, 255, 255, 0.92) !important;
      font-family: var(--font-sans);
      font-size: 0.9375rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      padding: 0 14px;
      min-width: auto;
    }

    .nav-links a[mat-button].active {
      background-color: rgba(255, 255, 255, 0.14);
      border-radius: 6px;
    }

    .nav-link-auth-active {
      font-weight: 600;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 6px;
    }

    .btn-auth-outline {
      margin-left: 8px;
      font-family: var(--font-sans) !important;
      font-weight: 600 !important;
      font-size: 0.8125rem !important;
      letter-spacing: 0.04em;
      color: var(--primary-white) !important;
      border: 2px solid rgba(255, 255, 255, 0.85) !important;
      border-radius: 6px !important;
      padding: 0 18px !important;
      min-height: 40px;
      background: transparent !important;
      box-shadow: none !important;
    }

    .btn-auth-outline:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      border-color: var(--primary-white) !important;
    }

    .user-name {
      margin-left: 6px;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sidenav-container {
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      bottom: 0;
      height: calc(100vh - 72px);
      z-index: 999;
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
    }

    .sidenav-container.mobile-only {
      display: none !important;
    }

    .mobile-sidenav {
      width: 280px;
      font-family: var(--font-sans);
    }

    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: var(--surface-page);
      color: var(--text-heading);
      font-weight: 600;
    }

    .mobile-user-info mat-icon {
      color: var(--navy-800);
    }

    @media (max-width: 768px) {
      .menu-button {
        display: inline-flex;
      }

      .desktop-nav {
        display: none;
      }

      .sidenav-container.mobile-only {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
      }

      .sidenav-container ::ng-deep .mat-drawer {
        pointer-events: auto;
      }

      .sidenav-container ::ng-deep .mat-drawer-backdrop {
        pointer-events: auto;
      }
    }
  `]
})
export class HeaderComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isAuthRoute = false;
  isRegisterRoute = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.updateAuthRouteFlags(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.updateAuthRouteFlags(e.urlAfterRedirects));
  }

  private updateAuthRouteFlags(url: string): void {
    this.isRegisterRoute = url.startsWith('/register');
    this.isAuthRoute = url.startsWith('/login') || this.isRegisterRoute;
  }

  logout(): void {
    this.authService.logout();
  }
}
