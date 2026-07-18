import type { Type } from '@angular/core';
import type { ThemeId } from '../../../core/theme/token-contract';

/**
 * A design idea is a *problem* — pricing, checkout, a dashboard — stated
 * independently of any language. Each registered design language may express it
 * in its own way, or not at all.
 *
 * The pages under "New Design Ideas" were all authored for Obsidian. Once the
 * showcase stopped pinning `data-theme="obsidian"` they began rendering under
 * every language, which reads as though Obsidian's structural choices — one dark
 * anchor card, high density, contained illustration — were shared by languages
 * that explicitly refuse them. A design idea carries a philosophy, so it cannot
 * be re-skinned by swapping tokens.
 *
 * A missing variant is therefore rendered as an explicit gap rather than filled
 * with another language's work. That gap is information: it says this language
 * has not answered this problem yet.
 */
export interface DesignIdeaVariant {
  readonly language: ThemeId;
  /** What this language's take does differently, and which of its slots drive that. */
  readonly emphasis: string;
  /** Reference image under docs/design-refs that informed the structure, if any. */
  readonly reference?: string;
  readonly load: () => Promise<Type<unknown>>;
}

export interface DesignIdea {
  readonly id: string;
  readonly label: string;
  /** The problem, stated without presupposing a solution. */
  readonly brief: string;
  readonly variants: readonly DesignIdeaVariant[];
}

export const DESIGN_IDEAS = [
  {
    id: 'pricing-section',
    label: 'Pricing Section',
    brief:
      'Present tiered commercial options so a reader can locate the tier that fits them and act, without re-reading.',
    variants: [
      {
        language: 'obsidian',
        emphasis:
          'One dark anchor card carries the recommended tier; hierarchy is weight and surface contrast, never colour. Illustration is clipped into the lower-right of each card.',
        reference: 'pricing1.jpg',
        load: () =>
          import(
            '../pages/new-design-ideas/pricing-section/pricing-section.component'
          ).then((m) => m.PricingSectionComponent),
      },
      {
        language: 'rdk-default',
        emphasis:
          'The conventional three-tier table with a "Most popular" marker — the pattern readers arrive already fluent in. Brand colour marks the recommended tier rather than surface inversion.',
        load: () =>
          import('./variants/pricing-modern.component').then((m) => m.PricingModernComponent),
      },
      {
        language: 'evolute',
        emphasis:
          'Flush numbered tiles with a gradient anchor tile; colour and elevation partition the row before any reading. No single tier is privileged — the emphasis budget is unbounded.',
        reference: 'pricing2.jpg',
        load: () =>
          import('./variants/pricing-evolute.component').then((m) => m.PricingEvoluteComponent),
      },
    ],
  },
  {
    id: 'erp-dashboard',
    label: 'ERP Dashboard',
    brief: 'Surface operational state so an operator can spot what needs attention at a glance.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'Dense KPI grid with a single dark card anchoring the decision-critical figure.',
        load: () =>
          import('../pages/new-design-ideas/erp-dashboard/erp-dashboard.component').then(
            (m) => m.ErpDashboardComponent,
          ),
      },
    ],
  },
  {
    id: 'erp-orders',
    label: 'ERP Orders',
    brief: 'List and triage orders so status and exceptions are readable without opening rows.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'High-density table; status confined to pill badges, polarity by weight.',
        load: () =>
          import('../pages/new-design-ideas/erp-orders/erp-orders.component').then(
            (m) => m.ErpOrdersComponent,
          ),
      },
    ],
  },
  {
    id: 'erp-invoice',
    label: 'ERP Invoice',
    brief: 'Render a single invoice for review and settlement.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'Monospace for every machine-generated figure; totals anchored on a dark card.',
        load: () =>
          import('../pages/new-design-ideas/erp-invoice/erp-invoice.component').then(
            (m) => m.ErpInvoiceComponent,
          ),
      },
    ],
  },
  {
    id: 'payment-checkout',
    label: 'Payment Checkout',
    brief: 'Take payment with the amount and obligations unambiguous at the point of commitment.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'Summary anchored dark; functional colour confined to status badges.',
        load: () =>
          import('../pages/new-design-ideas/payment-checkout/payment-checkout.component').then(
            (m) => m.PaymentCheckoutComponent,
          ),
      },
    ],
  },
  {
    id: 'payment-transactions',
    label: 'Transactions',
    brief: 'List financial movement so polarity and state are legible at scanning speed.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'Credits bold and primary, debits regular and muted — weight before colour.',
        load: () =>
          import(
            '../pages/new-design-ideas/payment-transactions/payment-transactions.component'
          ).then((m) => m.PaymentTransactionsComponent),
      },
    ],
  },
  {
    id: 'invoice-variants',
    label: 'Invoice Variants',
    brief: 'Compare structural approaches to the same invoice card.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'Six structural patterns explored under a single set of restraints.',
        load: () =>
          import('../pages/new-design-ideas/invoice-variants/invoice-variants.component').then(
            (m) => m.InvoiceVariantsComponent,
          ),
      },
    ],
  },
  {
    id: 'frosted-glass',
    label: 'Frosted Glass',
    brief: 'Explore translucent surfaces and the rules that keep them legible.',
    variants: [
      {
        language: 'obsidian',
        emphasis: 'Glass over painted content only; never over a flat contract surface.',
        load: () =>
          import('../pages/new-design-ideas/frosted-glass/frosted-glass.component').then(
            (m) => m.FrostedGlassComponent,
          ),
      },
    ],
  },
] as const satisfies readonly DesignIdea[];

export type DesignIdeaId = (typeof DESIGN_IDEAS)[number]['id'];

export function getDesignIdea(id: string): DesignIdea | undefined {
  return DESIGN_IDEAS.find((idea) => idea.id === id);
}

export function getVariant(idea: DesignIdea, language: string): DesignIdeaVariant | undefined {
  return idea.variants.find((variant) => variant.language === language);
}
