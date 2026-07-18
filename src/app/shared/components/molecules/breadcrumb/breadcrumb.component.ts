import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

@Component({
  selector: 'rdk-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="rdk-breadcrumb" aria-label="Breadcrumb">
      <ol class="rdk-breadcrumb__list">
        @for (item of items; track item.label; let last = $last) {
          <li class="rdk-breadcrumb__item">
            @if (!last && item.path) {
              <a
                class="rdk-breadcrumb__link"
                [routerLink]="item.path"
                (click)="itemClicked.emit(item)"
              >
                @if (item.icon) {
                  <span class="pi rdk-breadcrumb__icon" [class]="item.icon" aria-hidden="true"></span>
                }
                {{ item.label }}
              </a>
            } @else {
              <span
                class="rdk-breadcrumb__current"
                [attr.aria-current]="last ? 'page' : null"
              >
                @if (item.icon) {
                  <span class="pi rdk-breadcrumb__icon" [class]="item.icon" aria-hidden="true"></span>
                }
                {{ item.label }}
              </span>
            }

            @if (!last) {
              <span class="rdk-breadcrumb__sep pi pi-angle-right" aria-hidden="true"></span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [`
    :host { display: block; }

    .rdk-breadcrumb__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: var(--space-1);
    }

    .rdk-breadcrumb__item {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
    }

    .rdk-breadcrumb__link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1-5);
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      text-decoration: none;
      transition: color var(--duration-150) var(--ease-out);

      &:hover { color: var(--color-text-primary); text-decoration: underline; }

      &:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
        outline-offset: var(--color-focus-ring-offset);
        border-radius: var(--radius-sm);
      }
    }

    .rdk-breadcrumb__current {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1-5);
      font-size: var(--text-sm);
      color: var(--color-text-primary);
      font-weight: var(--font-medium);
    }

    .rdk-breadcrumb__sep {
      font-size: 0.625rem;
      color: var(--color-text-muted);
    }

    .rdk-breadcrumb__icon { font-size: 0.875em; }
  `],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Output() itemClicked = new EventEmitter<BreadcrumbItem>();
}
