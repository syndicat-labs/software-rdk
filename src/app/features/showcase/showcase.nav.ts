import { NavItem } from '../../layout/sidebar/sidebar.component';

export const SHOWCASE_NAV_ITEMS: NavItem[] = [
  {
    label: 'Components',
    icon: 'pi pi-th-large',
    items: [
      { label: 'Atoms',     icon: 'pi pi-circle',   routerLink: '/showcase/atoms/button' },
      { label: 'Molecules', icon: 'pi pi-clone',    routerLink: '/showcase/molecules/form-field' },
      { label: 'Organisms', icon: 'pi pi-table',    routerLink: '/showcase/organisms/card' },
    ],
  },
  {
    label: 'New Design Ideas',
    icon: 'pi pi-lightbulb',
    items: [
      { label: 'Pricing Section', icon: 'pi pi-tag',        routerLink: '/showcase/new-design-ideas/pricing-section' },
      { label: 'ERP Dashboard',  icon: 'pi pi-chart-bar',  routerLink: '/showcase/new-design-ideas/erp-dashboard' },
      { label: 'ERP Orders',     icon: 'pi pi-list',       routerLink: '/showcase/new-design-ideas/erp-orders' },
      { label: 'ERP Invoice',          icon: 'pi pi-file',         routerLink: '/showcase/new-design-ideas/erp-invoice' },
      { label: 'Payment Checkout',     icon: 'pi pi-credit-card',  routerLink: '/showcase/new-design-ideas/payment-checkout' },
      { label: 'Transactions',         icon: 'pi pi-arrows-h',     routerLink: '/showcase/new-design-ideas/payment-transactions' },
      { label: 'Invoice Variants',     icon: 'pi pi-file-edit',    routerLink: '/showcase/new-design-ideas/invoice-variants' },
      { label: 'Frosted Glass',        icon: 'pi pi-stop-circle',  routerLink: '/showcase/new-design-ideas/frosted-glass' },
    ],
  },
];
