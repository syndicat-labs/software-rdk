import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

@Component({
  selector: 'rdk-icon',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="rdk-icon pi"
      [ngClass]="['rdk-icon--' + size, name]"
      [attr.aria-hidden]="decorative ? 'true' : null"
      [attr.aria-label]="!decorative ? label || name : null"
      [attr.role]="!decorative ? 'img' : null"
    ></span>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; justify-content: center; }

    .rdk-icon {
      line-height: 1;
      flex-shrink: 0;
    }

    .rdk-icon--xs  { font-size: var(--icon-size-xs); }
    .rdk-icon--sm  { font-size: var(--icon-size-sm); }
    .rdk-icon--md  { font-size: var(--icon-size-md); }
    .rdk-icon--lg  { font-size: var(--icon-size-lg); }
    .rdk-icon--xl  { font-size: var(--icon-size-xl); }
    .rdk-icon--2xl { font-size: var(--icon-size-2xl); }
  `],
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() size: IconSize = 'md';
  @Input() label?: string;
  @Input() decorative = true;
}
