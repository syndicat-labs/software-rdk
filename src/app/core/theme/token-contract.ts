// ─── Token Contract Registry ──────────────────────────────────────────────────
// Authoritative list of all semantic tokens every theme must provide.
// Mirrors the token names declared in _contract.scss.
//
// Contract version: 1.0.0
// Bump version here and in _contract.scss when adding/removing required tokens.
//
// Used by ThemeService.validateTheme() in development mode to catch missing
// token implementations before they reach production.

export const CONTRACT_VERSION = '1.0.0';

export interface ThemeDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

export const THEME_REGISTRY: readonly ThemeDefinition[] = [
  {
    id: 'rdk-default',
    label: 'Default',
    description: 'RDK default light theme — canonical contract reference implementation',
  },
  {
    id: 'obsidian',
    label: 'Obsidian',
    description: 'Dark/light duality enterprise theme — mineral restraint, typographic authority',
  },
] as const;

export type ThemeId = typeof THEME_REGISTRY[number]['id'];

// Every theme registered in THEME_REGISTRY must provide all tokens listed here.
// These are the names of CSS custom properties on [data-theme="<id>"].
export const CONTRACT_TOKENS: readonly string[] = [
  // Text
  '--color-text-primary',
  '--color-text-secondary',
  '--color-text-muted',
  '--color-text-disabled',
  '--color-text-inverse',
  '--color-text-brand',
  '--color-text-danger',
  '--color-text-success',
  '--color-text-warning',
  '--color-text-info',
  // Backgrounds
  '--color-bg-base',
  '--color-bg-surface',
  '--color-bg-elevated',
  '--color-bg-sunken',
  '--color-bg-overlay',
  '--color-bg-brand',
  '--color-bg-brand-subtle',
  '--color-bg-danger',
  '--color-bg-danger-subtle',
  '--color-bg-success',
  '--color-bg-success-subtle',
  '--color-bg-warning',
  '--color-bg-warning-subtle',
  '--color-bg-info',
  '--color-bg-info-subtle',
  // Borders
  '--color-border-default',
  '--color-border-strong',
  '--color-border-muted',
  '--color-border-brand',
  '--color-border-danger',
  '--color-border-success',
  '--color-border-warning',
  '--color-border-info',
  '--color-border-focus',
  // Interactive
  '--color-hover-overlay',
  '--color-active-overlay',
  '--color-focus-ring',
  '--color-focus-ring-width',
  '--color-focus-ring-offset',
  '--color-focus-ring-glow',
  // Status groups
  '--color-status-success-bg',
  '--color-status-success-border',
  '--color-status-success-text',
  '--color-status-success-icon',
  '--color-status-warning-bg',
  '--color-status-warning-border',
  '--color-status-warning-text',
  '--color-status-warning-icon',
  '--color-status-danger-bg',
  '--color-status-danger-border',
  '--color-status-danger-text',
  '--color-status-danger-icon',
  '--color-status-info-bg',
  '--color-status-info-border',
  '--color-status-info-text',
  '--color-status-info-icon',
  // Spacing (semantic)
  '--space-component-xs',
  '--space-component-sm',
  '--space-component-md',
  '--space-component-lg',
  '--space-layout-xs',
  '--space-layout-sm',
  '--space-layout-md',
  '--space-layout-lg',
  // Radii (semantic)
  '--radius-component',
  '--radius-surface',
  '--radius-pill',
  // Navigation surface
  '--color-nav-bg',
  '--color-nav-text',
  '--color-nav-text-active',
  '--color-nav-text-subtle',
  '--color-nav-brand-gradient',
  '--color-nav-active-bg',
  '--color-nav-active-indicator',
  '--color-nav-icon-active',
  '--color-nav-icon-active-bg',
  '--color-nav-icon-hover-bg',
  '--color-nav-avatar-bg',
  '--color-nav-texture',
  // Featured surface
  '--color-surface-featured',
  '--color-surface-featured-border',
  '--color-surface-featured-text',
  '--color-surface-featured-muted',
  // Typography
  '--font-data',
] as const;

export interface ContractValidationResult {
  readonly valid: boolean;
  readonly themeId: string;
  readonly missing: readonly string[];
  readonly contractVersion: string;
}

// Checks that all contract tokens resolve to a non-empty value on the given element.
// Call in development only — getComputedStyle is expensive at this scale in production.
export function validateTheme(element: Element, themeId: string): ContractValidationResult {
  const computed = getComputedStyle(element);
  const missing = CONTRACT_TOKENS.filter(
    token => !computed.getPropertyValue(token).trim()
  );
  return {
    valid: missing.length === 0,
    themeId,
    missing,
    contractVersion: CONTRACT_VERSION,
  };
}
