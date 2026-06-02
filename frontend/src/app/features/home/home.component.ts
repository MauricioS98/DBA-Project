import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home-page">
      <section class="app-hero">
        <div class="app-hero__content">
          <h1 class="app-hero__title">Investigación UD</h1>
          <p class="app-hero__subtitle">Sistema de Gestión de Grupos de Investigación</p>
          <p class="app-hero__text">
            Centraliza, consulta y gestiona la información de los grupos de investigación
            de la Facultad de Ingenierí­a de la Universidad Distrital.
          </p>
          <div class="app-hero__actions">
            <a mat-stroked-button routerLink="/teams" class="auth-btn-pill auth-btn-pill--inline">
              <span class="auth-btn-pill__label">
                <mat-icon>search</mat-icon>
                Explorar grupos
              </span>
            </a>
            <a mat-stroked-button routerLink="/register" class="auth-btn-pill auth-btn-pill--inline auth-btn-pill--ghost">
              <span class="auth-btn-pill__label">
                <mat-icon>person_add</mat-icon>
                Registrarse
              </span>
            </a>
          </div>
        </div>
      </section>

      <section class="app-features">
        <h2 class="app-features__title">Funcionalidades principales</h2>
        <div class="app-grid app-feature-grid">
          <article class="app-feature-card">
            <div class="app-feature-card__icon" aria-hidden="true">
              <svg class="app-feature-card__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" focusable="false">
                <path d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM208 288l64 0c44.2 0 80 35.8 80 80 0 8.8-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16 0-44.2 35.8-80 80-80zm-24-96a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zm0 128c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 320c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16z"></path>
              </svg>
            </div>
            <h3>Directorio de grupos</h3>
            <p>Consulta un directorio unificado de grupos clasificados por área o línea de investigación.</p>
          </article>
          <article class="app-feature-card">
            <div class="app-feature-card__icon" aria-hidden="true">
              <svg class="app-feature-card__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" focusable="false">
                <path d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l180 0c-10.5-14.6-19-30.7-25.1-48l-74.9 0 0-80c0-17.7 14.3-32 32-32l32 0c2 0 4 .2 5.9 .5 6-23.6 16.3-45.4 30.1-64.5l-4 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 4c27.5-19.8 60.3-32.4 96-35.4L416 64c0-35.3-28.7-64-64-64L96 0zm32 112c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zM128 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM576 400a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-86.6-60.9c7.1 5.2 8.7 15.2 3.5 22.3l-64 88c-2.8 3.8-7 6.2-11.7 6.5s-9.3-1.3-12.6-4.6l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0l26.8 26.8 53-72.9c5.2-7.1 15.2-8.7 22.4-3.5z"></path>
              </svg>
            </div>
            <h3>Proyectos activos</h3>
            <p>Visualiza proyectos activos y producción científica de los grupos de investigación.</p>
          </article>
          <article class="app-feature-card">
            <div class="app-feature-card__icon" aria-hidden="true">
              <svg class="app-feature-card__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" focusable="false">
                <path d="M64 112c0-26.5 21.5-48 48-48l416 0c26.5 0 48 21.5 48 48l0 81.4c-24.4-11.2-51.4-17.4-80-17.4-87.7 0-161.7 58.8-184.7 139.2-7.1-1.3-14.1-4.2-20.1-8.8l-208-156C71.1 141.3 64 127.1 64 112zM304 368c0 28.6 6.2 55.6 17.4 80L128 448c-35.3 0-64-28.7-64-64l0-188 198.4 148.8c12.6 9.4 26.9 15.4 41.7 17.9 0 1.8-.1 3.5-.1 5.3zm48 0a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm201.4-60.9c-7.1-5.2-17.2-3.6-22.4 3.5l-53 72.9-26.8-26.8c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c3.3 3.3 7.9 5 12.6 4.6s8.9-2.8 11.7-6.5l64-88c5.2-7.1 3.6-17.2-3.5-22.3z"></path>
              </svg>
            </div>
            <h3>Solicitudes de vinculación</h3>
            <p>Solicita y da seguimiento a las admisiones a los grupos de investigación.</p>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .home-page { background: var(--auth-bg); min-height: calc(100vh - 72px - 88px); }
    .app-feature-grid {
      grid-template-columns: repeat(3, minmax(260px, 360px));
      justify-content: center;
      justify-items: center;
      align-items: stretch;
      width: 100%;
      margin-inline: auto;
    }
    .app-feature-card {
      width: 100%;
      max-width: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .app-feature-card__icon {
      width: 3.5rem;
      height: 3.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      color: var(--navy-800);
      flex: 0 0 auto;
      line-height: 0;
      overflow: visible;
    }
    .app-feature-card__svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
      overflow: visible;
    }
    @media (max-width: 960px) {
      .app-feature-grid {
        grid-template-columns: repeat(2, minmax(260px, 360px));
      }
    }
    @media (max-width: 768px) {
      .app-feature-grid {
        grid-template-columns: minmax(260px, 360px);
      }
    }
  `]
})
export class HomeComponent {}
