import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../../shared/components/molecules/form-field/form-field.component';
import { InputComponent } from '../../../../shared/components/molecules/input/input.component';
import { TextareaComponent } from '../../../../shared/components/molecules/textarea/textarea.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { CardComponent } from '../../../../shared/components/organisms/card/card.component';
import { SelectComponent } from '../../../../shared/components/molecules/select/select.component';

interface Resource {
  id: number;
  name: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    TextareaComponent,
    SelectComponent,
    ButtonComponent,
    CardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { margin-bottom: 1.5rem; }
    h1 { margin: 0 0 0.5rem 0; font-size: 1.875rem; color: var(--color-text-primary); }
    .breadcrumb { font-size: 0.875rem; color: var(--color-text-muted); }
    .form-group { margin-bottom: 1rem; }
    .actions { display: flex; gap: 0.75rem; margin-top: 2rem; }
  `],
  template: `
    <div class="container">
      <div class="header">
        <h1>Resource details</h1>
        <p class="breadcrumb"><a routerLink="/app/resources">Resources</a> / {{ resource()?.name || 'Loading…' }}</p>
      </div>

      <rdk-card variant="outlined">
        <div slot="body">
          <form [formGroup]="form">
            <div class="form-group">
              <rdk-form-field label="Name">
                <rdk-input formControlName="name" />
              </rdk-form-field>
            </div>

            <div class="form-group">
              <rdk-form-field label="Description">
                <rdk-textarea formControlName="description" [rows]="4" />
              </rdk-form-field>
            </div>

            <div class="form-group">
              <rdk-form-field label="Status">
                <rdk-select
                  formControlName="status"
                  [options]="[
                    { label: 'Active', value: 'Active' },
                    { label: 'Inactive', value: 'Inactive' }
                  ]"
                />
              </rdk-form-field>
            </div>

            <div class="actions">
              <rdk-button variant="primary" (clicked)="onSave()">Save</rdk-button>
              <rdk-button variant="ghost" routerLink="/app/resources">Cancel</rdk-button>
            </div>
          </form>
        </div>
      </rdk-card>
    </div>
  `,
})
export class ResourceDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  protected readonly resource = signal<Resource | null>(null);

  protected readonly form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    status: ['Active'],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.resource.set({ id: 0, name: 'New Resource', description: '', status: 'Active' });
    } else {
      // TODO: Load from API when backend ready
      this.resource.set({ id: 1, name: 'Resource One', description: 'Test', status: 'Active' });
      this.form.patchValue(this.resource()!);
    }
  }

  protected onSave(): void {
    if (this.form.invalid) return;
    // TODO: Save to API when backend ready
  }
}
