import { Routes } from '@angular/router';
import { ShowcaseLayoutComponent } from './showcase-layout/showcase-layout.component';
import { PricingSectionComponent } from './pages/new-design-ideas/pricing-section/pricing-section.component';
import { ErpDashboardComponent } from './pages/new-design-ideas/erp-dashboard/erp-dashboard.component';
import { ErpOrdersComponent } from './pages/new-design-ideas/erp-orders/erp-orders.component';
import { ErpInvoiceComponent } from './pages/new-design-ideas/erp-invoice/erp-invoice.component';
import { PaymentCheckoutComponent } from './pages/new-design-ideas/payment-checkout/payment-checkout.component';
import { PaymentTransactionsComponent } from './pages/new-design-ideas/payment-transactions/payment-transactions.component';
import { InvoiceVariantsComponent } from './pages/new-design-ideas/invoice-variants/invoice-variants.component';
import { FrostedGlassComponent } from './pages/new-design-ideas/frosted-glass/frosted-glass.component';
// Atoms
import { ButtonShowcaseComponent } from './pages/atoms/button-showcase/button-showcase.component';
import { BadgeShowcaseComponent } from './pages/atoms/badge-showcase/badge-showcase.component';
import { AvatarShowcaseComponent } from './pages/atoms/avatar-showcase/avatar-showcase.component';
import { ChipShowcaseComponent } from './pages/atoms/chip-showcase/chip-showcase.component';
import { SpinnerShowcaseComponent } from './pages/atoms/spinner-showcase/spinner-showcase.component';
import { DividerShowcaseComponent } from './pages/atoms/divider-showcase/divider-showcase.component';
import { IconShowcaseComponent } from './pages/atoms/icon-showcase/icon-showcase.component';
// Molecules — form
import { FormFieldShowcaseComponent } from './pages/molecules/form-field-showcase/form-field-showcase.component';
import { InputShowcaseComponent } from './pages/molecules/input-showcase/input-showcase.component';
import { TextareaShowcaseComponent } from './pages/molecules/textarea-showcase/textarea-showcase.component';
import { SelectShowcaseComponent } from './pages/molecules/select-showcase/select-showcase.component';
import { CheckboxShowcaseComponent } from './pages/molecules/checkbox-showcase/checkbox-showcase.component';
import { RadioShowcaseComponent } from './pages/molecules/radio-showcase/radio-showcase.component';
import { ToggleShowcaseComponent } from './pages/molecules/toggle-showcase/toggle-showcase.component';
// Molecules — nav/feedback
import { AlertShowcaseComponent } from './pages/molecules/alert-showcase/alert-showcase.component';
import { SearchInputShowcaseComponent } from './pages/molecules/search-input-showcase/search-input-showcase.component';
import { PaginationShowcaseComponent } from './pages/molecules/pagination-showcase/pagination-showcase.component';
import { BreadcrumbShowcaseComponent } from './pages/molecules/breadcrumb-showcase/breadcrumb-showcase.component';
// Organisms
import { CardShowcaseComponent } from './pages/organisms/card-showcase/card-showcase.component';
import { ModalShowcaseComponent } from './pages/organisms/modal-showcase/modal-showcase.component';
import { DataTableShowcaseComponent } from './pages/organisms/data-table-showcase/data-table-showcase.component';
import { TabsShowcaseComponent } from './pages/organisms/tabs-showcase/tabs-showcase.component';
import { AccordionShowcaseComponent } from './pages/organisms/accordion-showcase/accordion-showcase.component';
import { DatePickerShowcaseComponent } from './pages/organisms/date-picker-showcase/date-picker-showcase.component';
import { FileUploadShowcaseComponent } from './pages/organisms/file-upload-showcase/file-upload-showcase.component';
import { ComboboxShowcaseComponent } from './pages/organisms/combobox-showcase/combobox-showcase.component';
// Protocol
import { LanguageComparisonComponent } from './pages/language-comparison/language-comparison.component';

export const SHOWCASE_ROUTES: Routes = [
  // Deliberately outside ShowcaseLayoutComponent: the comparison renders one
  // panel per registered language and needs the horizontal room the component
  // sidebar would take. It is a protocol view, not a component page.
  {
    path: 'protocol/languages',
    component: LanguageComparisonComponent,
    data: { title: 'Design Languages' },
  },
  {
    path: '',
    component: ShowcaseLayoutComponent,
    children: [
      { path: '', redirectTo: 'atoms/button', pathMatch: 'full' },
      // Atoms
      { path: 'atoms/button', component: ButtonShowcaseComponent, data: { title: 'Button' } },
      { path: 'atoms/badge', component: BadgeShowcaseComponent, data: { title: 'Badge' } },
      { path: 'atoms/avatar', component: AvatarShowcaseComponent, data: { title: 'Avatar' } },
      { path: 'atoms/chip', component: ChipShowcaseComponent, data: { title: 'Chip' } },
      { path: 'atoms/spinner', component: SpinnerShowcaseComponent, data: { title: 'Spinner' } },
      { path: 'atoms/divider', component: DividerShowcaseComponent, data: { title: 'Divider' } },
      { path: 'atoms/icon', component: IconShowcaseComponent, data: { title: 'Icon' } },
      // Molecules
      { path: 'molecules/form-field', component: FormFieldShowcaseComponent, data: { title: 'Form Field' } },
      { path: 'molecules/input', component: InputShowcaseComponent, data: { title: 'Input' } },
      { path: 'molecules/textarea', component: TextareaShowcaseComponent, data: { title: 'Textarea' } },
      { path: 'molecules/select', component: SelectShowcaseComponent, data: { title: 'Select' } },
      { path: 'molecules/checkbox', component: CheckboxShowcaseComponent, data: { title: 'Checkbox' } },
      { path: 'molecules/radio', component: RadioShowcaseComponent, data: { title: 'Radio Group' } },
      { path: 'molecules/toggle', component: ToggleShowcaseComponent, data: { title: 'Toggle' } },
      { path: 'molecules/alert', component: AlertShowcaseComponent, data: { title: 'Alert' } },
      { path: 'molecules/search-input', component: SearchInputShowcaseComponent, data: { title: 'Search Input' } },
      { path: 'molecules/pagination', component: PaginationShowcaseComponent, data: { title: 'Pagination' } },
      { path: 'molecules/breadcrumb', component: BreadcrumbShowcaseComponent, data: { title: 'Breadcrumb' } },
      // Organisms
      { path: 'organisms/card', component: CardShowcaseComponent, data: { title: 'Card' } },
      { path: 'organisms/modal', component: ModalShowcaseComponent, data: { title: 'Modal' } },
      { path: 'organisms/data-table', component: DataTableShowcaseComponent, data: { title: 'Data Table' } },
      { path: 'organisms/tabs', component: TabsShowcaseComponent, data: { title: 'Tabs' } },
      { path: 'organisms/accordion', component: AccordionShowcaseComponent, data: { title: 'Accordion' } },
      { path: 'organisms/date-picker', component: DatePickerShowcaseComponent, data: { title: 'Date Picker' } },
      { path: 'organisms/file-upload', component: FileUploadShowcaseComponent, data: { title: 'File Upload' } },
      { path: 'organisms/combobox', component: ComboboxShowcaseComponent, data: { title: 'Combobox' } },
      // New Design Ideas
      { path: 'new-design-ideas/pricing-section', component: PricingSectionComponent, data: { title: 'Pricing Section' } },
      { path: 'new-design-ideas/erp-dashboard',   component: ErpDashboardComponent,   data: { title: 'ERP Dashboard' } },
      { path: 'new-design-ideas/erp-orders',      component: ErpOrdersComponent,      data: { title: 'ERP Orders' } },
      { path: 'new-design-ideas/erp-invoice',          component: ErpInvoiceComponent,          data: { title: 'ERP Invoice' } },
      { path: 'new-design-ideas/payment-checkout',     component: PaymentCheckoutComponent,     data: { title: 'Payment Checkout' } },
      { path: 'new-design-ideas/payment-transactions', component: PaymentTransactionsComponent, data: { title: 'Transactions' } },
      { path: 'new-design-ideas/invoice-variants',      component: InvoiceVariantsComponent,      data: { title: 'Invoice Variants' } },
      { path: 'new-design-ideas/frosted-glass',         component: FrostedGlassComponent,         data: { title: 'Frosted Glass' } },
    ],
  },
];
