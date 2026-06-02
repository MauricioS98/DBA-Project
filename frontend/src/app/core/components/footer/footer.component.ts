import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" role="contentinfo">
      <div class="footer-inner">
        <p class="footer-line footer-line--primary">
          &copy; 2026 Universidad Distrital Francisco José de Caldas — Facultad de Ingeniería
        </p>
        <p class="footer-line footer-line--secondary">
          Sistema de Gestión de Grupos de Investigación · Investigación UD
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: linear-gradient(180deg, var(--navy-900) 0%, #061c28 100%);
      color: rgba(255, 255, 255, 0.88);
      padding: 20px clamp(16px, 4vw, 40px);
      margin-top: auto;
      font-family: var(--font-sans);
    }

    .footer-inner {
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .footer-line {
      margin: 0;
      line-height: 1.5;
    }

    .footer-line--primary {
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.01em;
    }

    .footer-line--secondary {
      font-size: 0.8125rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.72);
      letter-spacing: 0.02em;
    }

    @media (max-width: 600px) {
      .footer-line--primary {
        font-size: 0.8125rem;
      }

      .footer-line--secondary {
        font-size: 0.75rem;
      }
    }
  `]
})
export class FooterComponent {}
