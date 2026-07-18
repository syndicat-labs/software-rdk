import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type DividerDirection = 'h' | 'v';
export type DividerLabelAlign = 'left' | 'center' | 'right';

@Component({
  selector: 'rdk-divider',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rdk-divider"
      [ngClass]="hostClasses"
      role="separator"
      [attr.aria-orientation]="direction === 'v' ? 'vertical' : 'horizontal'"
    >
      @if (label && direction === 'h') {
        <span class="rdk-divider__label">{{ label }}</span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      flex-shrink: 0;
    }

    :host(.rdk-divider-vertical) {
      display: inline-block;
      height: 100%;
    }

    .rdk-divider {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--divider-label-color);
      font-size: var(--divider-label-size);

      // horizontal line
      &::before, &::after {
        content: '';
        flex: 1;
        height: var(--divider-thickness);
        background: var(--divider-color);
      }
    }

    // ── Vertical ───────────────────────────────────────────────────────────────
    .rdk-divider--v {
      flex-direction: column;
      width: var(--divider-thickness);
      height: 100%;
      align-self: stretch;

      &::before, &::after { width: var(--divider-thickness); height: auto; flex: 1; }
    }

    // ── No label ───────────────────────────────────────────────────────────────
    .rdk-divider--no-label {
      &::before { display: none; }
    }

    // ── Label alignment ────────────────────────────────────────────────────────
    .rdk-divider--left::before   { flex: 0 0 1rem; }
    .rdk-divider--right::after   { flex: 0 0 1rem; }

    .rdk-divider__label {
      white-space: nowrap;
      background: var(--divider-label-bg);
      padding: 0 var(--space-1);
    }
  `],
})
export class DividerComponent {
  @Input() direction: DividerDirection = 'h';
  @Input() label?: string;
  @Input() labelAlign: DividerLabelAlign = 'center';

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-divider--${this.direction}`]: true,
      [`rdk-divider--${this.labelAlign}`]: !!this.label,
      'rdk-divider--no-label': !this.label,
    };
  }
}
