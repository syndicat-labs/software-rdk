import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertComponent } from '../../../../../shared/components/molecules/alert/alert.component';

@Component({
  selector: 'app-alert-showcase',
  standalone: true,
  imports: [AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host{display:block}.showcase-page{max-width:700px;margin:0 auto}h1{font-size:var(--text-4xl);font-weight:var(--font-bold);margin:0 0 var(--space-4);color:var(--color-text-primary)}.showcase-page__intro{font-size:var(--text-lg);color:var(--color-text-secondary);margin:0 0 var(--space-8)}.showcase-section{margin-bottom:var(--space-8);h2{font-size:var(--text-2xl);font-weight:var(--font-semibold);margin:0 0 var(--space-4);color:var(--color-text-primary)}}.showcase-stack{display:flex;flex-direction:column;gap:var(--space-3)}`],
  template: `
    <div class="showcase-page">
      <h1>Alert</h1>
      <p class="showcase-page__intro">General-purpose status messages for info, success, warning, and error feedback.</p>

      <section class="showcase-section">
        <h2>Severities</h2>
        <div class="showcase-stack">
          <rdk-alert severity="info" title="Information" message="Your account will be reviewed within 24 hours." />
          <rdk-alert severity="success" title="Success" message="Your changes have been saved." />
          <rdk-alert severity="warning" title="Warning" message="Your subscription expires in 3 days." />
          <rdk-alert severity="error" title="Error" message="We could not process your request. Please try again." />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Without Title</h2>
        <div class="showcase-stack">
          <rdk-alert severity="info" message="Here's some helpful information." />
          <rdk-alert severity="success" message="Operation completed successfully." />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Dismissible</h2>
        <div class="showcase-stack">
          <rdk-alert severity="warning" title="Heads up" message="This will overwrite your data." [dismissible]="true" />
          <rdk-alert severity="info" message="Click the × to dismiss this alert." [dismissible]="true" />
        </div>
      </section>

      <section class="showcase-section">
        <h2>Custom Content</h2>
        <div class="showcase-stack">
          <rdk-alert severity="info" title="Tip">
            Use <code>rdk-form-field</code> to wrap any input with a label and error message.
          </rdk-alert>
        </div>
      </section>
    </div>
  `,
})
export class AlertShowcaseComponent {}
