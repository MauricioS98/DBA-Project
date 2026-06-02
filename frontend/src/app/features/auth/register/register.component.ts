import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-page">
      <div class="auth-card auth-card--wide" role="main">
        <header class="auth-card__header">
          <h1 class="auth-card__title">Registro</h1>
          <p class="auth-card__subtitle">Crea tu cuenta con correo institucional</p>
        </header>

        <form class="auth-form" [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>
          <mat-form-field appearance="outline" class="auth-field" subscriptSizing="dynamic">
            <input matInput formControlName="name" placeholder="Nombre completo" autocomplete="name" />
            <mat-icon matPrefix>person_outline</mat-icon>
            @if (registerForm.get('name')?.hasError('required') && registerForm.get('name')?.touched) {
              <mat-error>El nombre es obligatorio</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="auth-field" subscriptSizing="dynamic">
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="Email institucional"
              autocomplete="email"
            />
            <mat-icon matPrefix>mail_outline</mat-icon>
            @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
              <mat-error>El email es obligatorio</mat-error>
            }
            @if (
              (registerForm.get('email')?.hasError('email') || registerForm.get('email')?.hasError('pattern')) &&
              registerForm.get('email')?.touched
            ) {
              <mat-error>Debe ser un email &#64;udistrital.edu.co</mat-error>
            }
          </mat-form-field>

          @if (registerForm.get('role')?.value && registerForm.get('role')?.value !== 'ADMINISTRADOR') {
            <mat-form-field appearance="outline" class="auth-field" subscriptSizing="dynamic">
              <mat-select
                formControlName="projectAreaId"
                placeholder="Proyecto curricular"
                panelClass="auth-select-panel"
              >
                @for (area of projectAreas; track area.proyectAreaId) {
                  <mat-option [value]="area.proyectAreaId">{{ area.name }}</mat-option>
                }
              </mat-select>
              <mat-icon matPrefix>school</mat-icon>
            </mat-form-field>
          }

          <mat-form-field appearance="outline" class="auth-field" subscriptSizing="dynamic">
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              placeholder="Contraseña"
              autocomplete="new-password"
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
            @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
              <mat-error>La contraseña es obligatoria</mat-error>
            }
            @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
              <mat-error>Mínimo 6 caracteres</mat-error>
            }
          </mat-form-field>

          <button
            mat-stroked-button
            type="submit"
            class="auth-btn-pill"
            [disabled]="registerForm.invalid || loading"
          >
            <span class="auth-btn-pill__label">
              @if (loading) {
                <mat-icon class="spinner" aria-hidden="true">hourglass_empty</mat-icon>
              } @else {
                <mat-icon aria-hidden="true">person_add</mat-icon>
              }
              {{ loading ? 'Registrando...' : 'Registrarse' }}
            </span>
          </button>
        </form>

        <p class="auth-card__footer">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="auth-card__link">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; flex: 1; }`]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  loading = false;
  projectAreas: { proyectAreaId: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/.*@udistrital\.edu\.co$/)]],
      role: ['ESTUDIANTE', [Validators.required]],
      projectAreaId: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.apiService.getProjectAreas().subscribe((areas) => {
      this.projectAreas = areas;
    });

    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      if (role === 'ADMINISTRADOR') {
        this.registerForm.get('projectAreaId')?.clearValidators();
      } else {
        this.registerForm.get('projectAreaId')?.setValidators([Validators.required]);
      }
      this.registerForm.get('projectAreaId')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      const formValue = this.registerForm.value;

      this.authService
        .register(
          formValue.name,
          formValue.email,
          formValue.password,
          formValue.role,
          formValue.projectAreaId
        )
        .subscribe({
          next: (response) => {
            this.loading = false;
            if (response.token) {
              setTimeout(() => {
                this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });
                this.router.navigate(['/dashboard']);
              }, 500);
            } else {
              this.snackBar.open('Error: No se recibió token de autenticación', 'Cerrar', { duration: 3000 });
            }
          },
          error: (error) => {
            this.loading = false;
            const errorMessage = error.error?.message || error.message || 'Error al registrar';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
          }
        });
    }
  }
}
