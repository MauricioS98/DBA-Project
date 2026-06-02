import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-page">
      <div class="auth-card" role="main">
        <header class="auth-card__header">
          <h1 class="auth-card__title">Iniciar Sesión</h1>
          <p class="auth-card__subtitle">Ingresa con tu correo institucional</p>
        </header>

        <form class="auth-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
          <mat-form-field appearance="outline" class="auth-field" subscriptSizing="dynamic">
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="Email"
              autocomplete="email"
            />
            <mat-icon matPrefix>mail_outline</mat-icon>
            @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
              <mat-error>El email es obligatorio</mat-error>
            }
            @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
              <mat-error>Email inválido</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="auth-field" subscriptSizing="dynamic">
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              placeholder="Contraseña"
              autocomplete="current-password"
            />
            <mat-icon matPrefix>lock_outline</mat-icon>
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hidePassword = !hidePassword"
              [attr.aria-label]="hidePassword ? 'Mostrar contraseña' : 'Ocultar contraseña'"
            >
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
              <mat-error>La contraseña es obligatoria</mat-error>
            }
          </mat-form-field>

          <button
            mat-stroked-button
            type="submit"
            class="auth-btn-pill"
            [disabled]="loginForm.invalid || loading"
          >
            <span class="auth-btn-pill__label">
              @if (loading) {
                <mat-icon class="spinner" aria-hidden="true">hourglass_empty</mat-icon>
              } @else {
                <mat-icon aria-hidden="true">login</mat-icon>
              }
              {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </span>
          </button>
        </form>

        <p class="auth-card__footer">
          ¿No tienes cuenta?
          <a routerLink="/register" class="auth-card__link">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; flex: 1; }`]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Credenciales inválidas', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
