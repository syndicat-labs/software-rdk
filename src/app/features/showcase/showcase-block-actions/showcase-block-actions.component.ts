import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/atoms/button/button.component';
import { CommandRecentsService } from '../../../core/command-palette/command-recents.service';
import { LoggingService } from '../../../core/logging/logging.service';

/**
 * Install / fork lifecycle for a showcase *block* (Craft Gallery pattern).
 *
 * Every component page in the Library is a block that can be taken into a
 * workspace: "Install" copies the `npx rdk add` command; "Fork" records the
 * block against the active user's recents and returns to Home, where the Bento
 * hero's "Continue where you left off" surfaces it. The command string is the
 * only real install affordance — there is no package registry on the mock
 * backend, which the UI makes explicit rather than inventing a fake spinner.
 */
@Component({
  selector: 'rdk-showcase-block-actions',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="block-actions" data-testid="block-actions">
      <div class="block-actions__id">
        <span class="pi pi-th-large block-actions__icon" aria-hidden="true"></span>
        <span class="block-actions__name">{{ blockLabel() }}</span>
        <code class="block-actions__path">{{ currentPath() }}</code>
      </div>
      <div class="block-actions__tools">
        <code class="block-actions__command">{{ installCommand() }}</code>
        <rdk-button variant="ghost" size="sm" (clicked)="copy()">
          {{ copied() ? 'Copied' : 'Copy' }}
        </rdk-button>
        <rdk-button variant="secondary" size="sm" (clicked)="fork()">Fork</rdk-button>
      </div>
    </div>
  `,
  styles: [
    `
      .block-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: var(--space-component-md);
        padding: var(--space-component-sm) var(--space-component-md);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        background: var(--color-bg-surface);
        margin-bottom: var(--space-layout-md);
      }

      .block-actions__id {
        display: flex;
        align-items: center;
        gap: var(--space-component-sm);
        min-width: 0;
      }

      .block-actions__icon {
        color: var(--color-text-muted);
        font-size: 0.875rem;
      }

      .block-actions__name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .block-actions__path {
        font-family: var(--font-data);
        font-size: 0.6875rem;
        color: var(--color-text-muted);
      }

      .block-actions__tools {
        display: flex;
        align-items: center;
        gap: var(--space-component-sm);
      }

      .block-actions__command {
        font-family: var(--font-data);
        font-size: 0.75rem;
        color: var(--color-text-secondary);
        background: var(--color-bg-sunken);
        border: 1px solid var(--color-border-muted);
        border-radius: var(--radius-component);
        padding: 0.3125rem 0.625rem;
        white-space: nowrap;
      }
    `,
  ],
})
export class ShowcaseBlockActionsComponent {
  private readonly router = inject(Router);
  private readonly recents = inject(CommandRecentsService);
  private readonly logger = inject(LoggingService);

  readonly blockLabel = input.required<string>();

  protected readonly copied = signal(false);

  protected readonly currentPath = computed(() => {
    const url = this.router.url.split('?')[0];
    return url.startsWith('/') ? url : `/${url}`;
  });

  protected readonly blockId = computed(() => {
    const segments = this.currentPath().split('/').filter(Boolean);
    return segments.at(-1) ?? 'block';
  });

  protected installCommand(): string {
    const packageName = this.blockId().toLowerCase();
    return `npx rdk add @rdk/${packageName}`;
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.installCommand());
      this.copied.set(true);
      this.logger.info('features/showcase', 'block.copy', { block: this.blockId() });
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      this.copied.set(false);
      this.logger.warn('features/showcase', 'block.copy_denied', { block: this.blockId() });
    }
  }

  protected fork(): void {
    this.recents.record(`${this.blockLabel()} block`, this.currentPath());
    this.logger.info('features/showcase', 'block.fork', { block: this.blockId(), label: this.blockLabel() });
    this.router.navigateByUrl('/app/dashboard');
  }
}