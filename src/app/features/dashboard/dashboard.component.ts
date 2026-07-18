import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rdk-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-stub">
      <h1>Dashboard</h1>
      <p>To be built.</p>
    </div>
  `,
  styles: [`
    .dashboard-stub {
      padding: 2rem;
      color: var(--color-text-primary);
      font-family: var(--font-family);
    }
    h1 { margin: 0 0 0.5rem; font-family: var(--display-font); }
    p  { margin: 0; color: var(--color-text-secondary); }
  `],
})
export class DashboardComponent {}
