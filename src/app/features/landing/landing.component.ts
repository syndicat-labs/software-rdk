import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'rdk-landing',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="landing-stub">
      <h1>RDK</h1>
      <p>Landing page — to be built.</p>
      <a routerLink="/login">Sign in</a>
    </div>
  `,
  styles: [`
    .landing-stub {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 1rem;
      background: var(--color-bg-base);
      color: var(--color-text-primary);
      font-family: var(--font-family);
    }
    h1 { margin: 0; font-family: var(--display-font); }
    p  { margin: 0; color: var(--color-text-secondary); }
    a  { color: var(--color-text-brand); }
  `],
})
export class LandingComponent {}
