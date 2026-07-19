/**
 * Dashboard domain types.
 *
 * Deliberately free of presentation concerns: polarity is expressed as a
 * `direction` plus whether that direction is good, not as a colour. Which
 * channel carries that meaning is the active design language's decision
 * (`polarityEncoding`), and a model that hardcoded "green" would make that
 * decision on the language's behalf.
 */

export type TrendDirection = 'up' | 'down' | 'flat';

export interface Kpi {
  readonly id: string;
  readonly label: string;
  /** Preformatted for display; the backend owns locale and currency. */
  readonly value: string;
  readonly delta: string;
  readonly direction: TrendDirection;
  /** Whether this direction is desirable — churn rising is not the same as revenue rising. */
  readonly favourable: boolean;
  /** 0–100, for the KPI meter. Absent where a proportion is meaningless. */
  readonly progress?: number;
  readonly caption?: string;
}

export type SettlementState = 'settled' | 'pending' | 'failed';

export interface Settlement {
  readonly id: string;
  readonly reference: string;
  readonly counterparty: string;
  readonly amount: string;
  /** Signed: the non-colour cue that keeps polarity legible in greyscale. */
  readonly signedAmount: string;
  readonly state: SettlementState;
  readonly receivedAt: string;
}

export interface DashboardSnapshot {
  readonly kpis: readonly Kpi[];
  readonly settlements: readonly Settlement[];
}
