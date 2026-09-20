import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';
import { InputComponent } from '../../molecules/input/input.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { AlertComponent } from '../../molecules/alert/alert.component';
import { getErrorMessage } from '../../../forms/form-error-handler';
import { requiredTrimValidator } from '../../../forms/validators/required-trim.validator';

@Component({
  selector: 'rdk-widget-config-drawer',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputComponent, ButtonComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible) {
      <div class="drawer__overlay" (click)="closed.emit()" data-testid="config-overlay"></div>
      <aside class="drawer" role="dialog" aria-label="Configure widget" data-testid="config-drawer">
        <header class="drawer__head">
          <h2 class="drawer__title">Configure {{ widgetTitle }}</h2>
          <button type="button" class="drawer__close" (click)="closed.emit()" aria-label="Close">×</button>
        </header>
        <form class="drawer__form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
          @if (banner) {
            <rdk-alert severity="error" [message]="banner" />
          }

          <rdk-form-field label="Title" [error]="getErrorMessage(form, 'title', labels)" [id]="'config-title'">
            <rdk-input formControlName="title" inputId="config-title" placeholder="Widget title" />
          </rdk-form-field>

          <div class="drawer__actions">
            <rdk-button variant="secondary" size="sm" (clicked)="closed.emit()" data-testid="config-cancel">Cancel</rdk-button>
            <rdk-button variant="primary" size="sm" type="submit" [disabled]="form.invalid" data-testid="config-save">Save</rdk-button>
          </div>
        </form>
      </aside>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .drawer__overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.32);
        z-index: 40;
      }

      .drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: 24rem;
        max-width: 90vw;
        height: 100%;
        background: var(--color-bg-surface);
        border-left: 1px solid var(--color-border-default);
        box-shadow: var(--elevation-overlay);
        z-index: 41;
        display: flex;
        flex-direction: column;
      }

      .drawer__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--space-component-lg);
        border-bottom: 1px solid var(--color-border-default);
      }

      .drawer__title {
        margin: 0;
        font-size: 1rem;
        color: var(--color-text-primary);
        font-family: var(--font-heading);
      }

      .drawer__close {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-pill);
        background: var(--color-bg-surface);
        color: var(--color-text-secondary);
        cursor: pointer;
      }

      .drawer__close:focus-visible {
        outline: var(--color-focus-ring-width) solid var(--color-focus-ring);
      }

      .drawer__form {
        flex: 1;
        padding: var(--space-component-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-component-md);
      }

      .drawer__actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-component-sm);
        margin-top: auto;
      }
    `,
  ],
})
export class WidgetConfigDrawerComponent implements OnChanges {
  @Input() visible = false;
  @Input() widgetTitle = '';
  @Input() initialTitle = '';
  @Output() closed = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ title: string }>();

  private readonly fb = inject(FormBuilder);

  protected banner = '';
  protected readonly labels: Record<string, string> = { title: 'Title' };
  protected readonly getErrorMessage = getErrorMessage;

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [requiredTrimValidator, Validators.maxLength(40)]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialTitle'] || changes['visible']) {
      if (this.visible) {
        this.form.setValue({ title: this.initialTitle });
        this.banner = '';
      }
    }
  }

  protected submit(): void {
    if (this.form.invalid) return;
    const { title } = this.form.getRawValue();
    this.save.emit({ title });
  }
}
