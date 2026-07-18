import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTableComponent, ColumnDef } from '../../../../shared/components/organisms/data-table/data-table.component';
import { ButtonComponent } from '../../../../shared/components/atoms/button/button.component';
import { CardComponent } from '../../../../shared/components/organisms/card/card.component';

interface Resource {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

const MOCK_RESOURCES: Resource[] = [
  { id: 1, name: 'Resource One', description: 'First test resource', status: 'Active', createdAt: '2026-05-15' },
  { id: 2, name: 'Resource Two', description: 'Second test resource', status: 'Active', createdAt: '2026-05-20' },
  { id: 3, name: 'Resource Three', description: 'Third test resource', status: 'Inactive', createdAt: '2026-05-10' },
];

const COLUMNS: ColumnDef<Resource>[] = [
  { field: 'name', header: 'Name', sortable: true },
  { field: 'description', header: 'Description', sortable: false },
  { field: 'status', header: 'Status', sortable: true },
  { field: 'createdAt', header: 'Created', sortable: true },
];

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [RouterLink, DataTableComponent, ButtonComponent, CardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .container { max-width: 1000px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h1 { margin: 0; font-size: 1.875rem; color: var(--color-text-primary); }
  `],
  template: `
    <div class="container">
      <div class="header">
        <h1>Resources</h1>
        <rdk-button variant="primary" routerLink="/app/resources/new">Create resource</rdk-button>
      </div>

      <rdk-card variant="outlined">
        <div slot="body">
          <rdk-data-table [columns]="columns" [rows]="resources" />
        </div>
      </rdk-card>
    </div>
  `,
})
export class ResourceListComponent {
  protected readonly columns = COLUMNS;
  protected readonly resources = MOCK_RESOURCES;
}
