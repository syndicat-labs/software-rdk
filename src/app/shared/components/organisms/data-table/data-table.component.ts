import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

export interface ColumnDef<T = unknown> {
  field: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'rdk-data-table',
  standalone: true,
  imports: [TableModule, SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rdk-table-wrapper">
      @if (loading) {
        <div class="rdk-table-overlay">
          <rdk-spinner size="lg" label="Loading table data…" />
        </div>
      }

      <p-table
        [value]="rows"
        [columns]="columns"
        [loading]="loading"
        [selection]="selection()"
        [selectionMode]="selectable ? 'multiple' : null"
        (selectionChange)="selection.set($event); selectionChange.emit($event)"
        dataKey="id"
        [styleClass]="'rdk-table ' + (selectable ? 'rdk-table--selectable' : '')"
      >
        <ng-template pTemplate="header" let-columns>
          <tr>
            @if (selectable) {
              <th class="rdk-table__select-col">
                <p-tableHeaderCheckbox />
              </th>
            }
            @for (col of columns; track col.field) {
              <th
                [pSortableColumn]="col.sortable ? col.field : ''"
                [style.width]="col.width || 'auto'"
              >
                {{ col.header }}
                @if (col.sortable) {
                  <p-sortIcon [field]="col.field" />
                }
              </th>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-row let-columns="columns">
          <tr
            class="rdk-table__row"
            [pSelectableRow]="selectable ? row : null"
            (click)="rowClick.emit(row)"
          >
            @if (selectable) {
              <td class="rdk-table__select-col">
                <p-tableCheckbox [value]="row" />
              </td>
            }
            @for (col of columns; track col.field) {
              <td>{{ row[col.field] }}</td>
            }
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td [attr.colspan]="columns.length + (selectable ? 1 : 0)" class="rdk-table__empty">
              No records found.
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .rdk-table-wrapper {
      position: relative;
      border: 1px solid var(--color-border-default);
      border-radius: var(--radius-surface);
      overflow: hidden;
    }

    .rdk-table-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255 255 255 / 0.8);
      z-index: 10;
    }

    ::ng-deep .rdk-table {
      .p-datatable-table { border-collapse: collapse; width: 100%; }
      .p-datatable-thead > tr > th {
        padding: var(--space-3) var(--space-4);
        background: var(--color-bg-sunken);
        border-bottom: 1px solid var(--color-border-default);
        font-size: var(--text-sm);
        font-weight: var(--font-semibold);
        color: var(--color-text-secondary);
        text-align: left;
        white-space: nowrap;
      }
      .p-datatable-tbody > tr {
        border-bottom: 1px solid var(--color-border-muted);
        transition: background var(--duration-100) var(--ease-out);

        &:hover { background: var(--color-bg-sunken); }
        &:last-child { border-bottom: none; }

        > td {
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          color: var(--color-text-primary);
        }
      }
    }

    .rdk-table__select-col { width: 3rem; }

    .rdk-table__empty {
      text-align: center;
      padding: var(--space-12) var(--space-4) !important;
      color: var(--color-text-muted);
      font-size: var(--text-sm);
    }
  `],
})
export class DataTableComponent<T = Record<string, unknown>> {
  @Input() columns: ColumnDef<T>[] = [];
  @Input() rows: T[] = [];
  @Input() loading = false;
  @Input() selectable = false;

  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  protected readonly selection = signal<T[]>([]);
}
