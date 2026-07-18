import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'rounded';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

@Component({
  selector: 'rdk-avatar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rdk-avatar"
      [ngClass]="hostClasses"
      [attr.aria-label]="label || name || 'Avatar'"
      role="img"
    >
      @if (src && !imgError()) {
        <img
          class="rdk-avatar__img"
          [src]="src"
          [alt]="alt || name || ''"
          (error)="imgError.set(true)"
        />
      } @else if (initials()) {
        <span class="rdk-avatar__initials" aria-hidden="true">{{ initials() }}</span>
      } @else {
        <span class="pi pi-user rdk-avatar__icon" aria-hidden="true"></span>
      }
    </div>
  `,
  styles: [`
    :host { display: inline-block; flex-shrink: 0; }

    .rdk-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--color-brand-400), var(--color-violet-500));
      color: var(--color-neutral-0);
      overflow: hidden;
      flex-shrink: 0;
      font-family: var(--font-family);
    }

    // ── Shapes ─────────────────────────────────────────────────────────────────
    .rdk-avatar--circle  { border-radius: var(--avatar-radius-circle); }
    .rdk-avatar--rounded { border-radius: var(--avatar-radius-rounded); }

    // ── Sizes ──────────────────────────────────────────────────────────────────
    .rdk-avatar--xs {
      width: var(--avatar-size-xs);
      height: var(--avatar-size-xs);
      font-size: 0.5625rem;
    }
    .rdk-avatar--sm {
      width: var(--avatar-size-sm);
      height: var(--avatar-size-sm);
      font-size: 0.6875rem;
    }
    .rdk-avatar--md {
      width: var(--avatar-size-md);
      height: var(--avatar-size-md);
      font-size: 0.8125rem;
    }
    .rdk-avatar--lg {
      width: var(--avatar-size-lg);
      height: var(--avatar-size-lg);
      font-size: 1rem;
    }
    .rdk-avatar--xl {
      width: var(--avatar-size-xl);
      height: var(--avatar-size-xl);
      font-size: 1.375rem;
    }

    .rdk-avatar__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rdk-avatar__initials {
      font-weight: var(--avatar-font-weight);
      line-height: 1;
      letter-spacing: 0.02em;
    }

    .rdk-avatar__icon {
      font-size: 0.8em;
      opacity: 0.85;
    }
  `],
})
export class AvatarComponent implements OnChanges {
  @Input() src?: string;
  @Input() alt?: string;
  @Input() name?: string;
  @Input() icon?: string;
  @Input() size: AvatarSize = 'md';
  @Input() shape: AvatarShape = 'circle';
  @Input() label?: string;

  protected readonly imgError = signal(false);

  ngOnChanges(): void {
    this.imgError.set(false);
  }

  protected initials(): string {
    if (this.src && !this.imgError()) return '';
    return this.name ? getInitials(this.name) : '';
  }

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-avatar--${this.size}`]: true,
      [`rdk-avatar--${this.shape}`]: true,
    };
  }
}
