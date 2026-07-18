import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type CardVariant = 'default' | 'elevated' | 'outlined';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'rdk-card',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-card" [ngClass]="hostClasses">
      <ng-content select="[slot=header]" />
      <div class="rdk-card__body">
        <ng-content />
      </div>
      <ng-content select="[slot=footer]" />
      <ng-content select="[slot=actions]" />
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-card {
      background: var(--card-bg);
      border-radius: var(--card-radius);
      overflow: hidden;
    }

    .rdk-card--default {
      border: var(--card-border);
      box-shadow: var(--card-shadow);
    }

    .rdk-card--elevated {
      border: var(--card-border);
      box-shadow: var(--card-shadow-elevated);
    }

    .rdk-card--outlined {
      border: 2px solid var(--color-border-default);
      box-shadow: none;
    }

    .rdk-card__body {
      &:empty { display: none; }
    }

    .rdk-card--pad-sm .rdk-card__body  { padding: var(--card-padding-sm); }
    .rdk-card--pad-md .rdk-card__body  { padding: var(--card-padding-md); }
    .rdk-card--pad-lg .rdk-card__body  { padding: var(--card-padding-lg); }
  `],
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() padding: CardPadding = 'md';

  protected get hostClasses(): Record<string, boolean> {
    return {
      [`rdk-card--${this.variant}`]: true,
      [`rdk-card--pad-${this.padding}`]: true,
    };
  }
}
