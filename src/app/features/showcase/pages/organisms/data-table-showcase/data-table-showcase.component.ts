import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataTableComponent, ColumnDef } from '../../../../../shared/components/organisms/data-table/data-table.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const USERS: User[] = [
  { id: 1, name: 'Alice Johnson',   email: 'alice@example.com',  role: 'Admin',       status: 'Active'   },
  { id: 2, name: 'Bob Smith',       email: 'bob@example.com',    role: 'Editor',      status: 'Active'   },
  { id: 3, name: 'Carol White',     email: 'carol@example.com',  role: 'Viewer',      status: 'Inactive' },
  { id: 4, name: 'David Brown',     email: 'david@example.com',  role: 'Editor',      status: 'Active'   },
  { id: 5, name: 'Eve Martinez',    email: 'eve@example.com',    role: 'Admin',       status: 'Pending'  },
];

const COLUMNS: ColumnDef<User>[] = [
  { field: 'name',   header: 'Name',   sortable: true },
  { field: 'email',  header: 'Email',  sortable: true },
  { field: 'role',   header: 'Role',   sortable: false },
  { field: 'status', header: 'Status', sortable: true },
];

@Component({
  selector: 'app-data-table-showcase',
  standalone: true,
  imports: [DataTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host { display: block; }
    .showcase-page { max-width: 900px; margin: 0 auto; }
    h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); margin: 0 0 var(--space-4); color: var(--color-text-primary); }
    .showcase-page__intro { font-size: var(--text-lg); color: var(--color-text-secondary); margin: 0 0 var(--space-8); }
    .showcase-section { margin-bottom: var(--space-8); h2 { font-size: var(--text-2xl); font-weight: var(--font-semibold); margin: 0 0 var(--space-4); color: var(--color-text-primary); } }
    .note { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-2); }
  `],
  template: `
    <div class="showcase-page">
      <h1>Data Table</h1>
      <p class="showcase-page__intro">Generic typed table wrapping PrimeNG p-table with sortable columns and row selection.</p>

      <section class="showcase-section">
        <h2>Basic (sortable)</h2>
        <rdk-data-table [columns]="columns" [rows]="users" />
      </section>

      <section class="showcase-section">
        <h2>Loading state</h2>
        <rdk-data-table [columns]="columns" [rows]="[]" [loading]="true" />
      </section>

      <section class="showcase-section">
        <h2>Empty state</h2>
        <rdk-data-table [columns]="columns" [rows]="[]" />
      </section>

      <section class="showcase-section">
        <h2>Selectable rows</h2>
        <rdk-data-table
          [columns]="columns"
          [rows]="users"
          [selectable]="true"
          (selectionChange)="selection.set($event)"
        />
        @if (selection().length) {
          <p class="note">{{ selection().length }} row(s) selected</p>
        }
      </section>
    </div>
  `,
})
export class DataTableShowcaseComponent {
  readonly columns = COLUMNS;
  readonly users = USERS;
  readonly selection = signal<User[]>([]);
}
