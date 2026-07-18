// ─── Design Language Protocol — L2 (Policy) ───────────────────────────────────
// See docs/design-refs/DESIGN-LANGUAGE-PROTOCOL.md
//
// The L1 token contract (token-contract.ts) governs the VALUES a design language
// supplies. This file governs the RULES it commits to.
//
// Obsidian's most characteristic decisions — hierarchy without colour, one dark
// card per layout, monospace as a semantic signal — cannot be expressed as CSS
// custom properties, so they previously existed only as prose written as if it
// were universal system law. It is not: it is one language's position, and a
// different language may legitimately disagree on every axis.
//
// Every dimension below is a closed union rather than free text. A policy that
// cannot be compared across languages is documentation, not protocol.
//
// Protocol version: 1.0.0

export const PROTOCOL_VERSION = '1.0.0';

/** Channels a language may use to express hierarchy. */
export type HierarchySignal =
  'weight' | 'size' | 'surface-contrast' | 'position' | 'opacity' | 'color' | 'elevation';

/** What colour is permitted to do. */
export type ColorRole =
  /** Semantic signals and contained illustration only; never hierarchy or decoration. */
  | 'functional-only'
  /** Colour may additionally carry brand expression and hierarchy. */
  | 'expressive';

/** Where semantic (success/warning/danger) colour may appear. */
export type FunctionalColorContainment =
  /** Inside pill badges only — never surfaces, row backgrounds or body text. */
  | 'badge-only'
  /** May tint surfaces and rows in addition to badges. */
  | 'surface-permitted';

/**
 * How many high-emphasis (inverted//anchor) surfaces may appear in one view.
 * A finite budget makes "two competing dark cards" a stated error rather than a
 * matter of taste. Not statically checkable — see protocol §5, tier C.
 */
export type EmphasisSurfaceBudget = 1 | 2 | 'unbounded';

/** What monospace type is allowed to mark. */
export type MonospaceScope =
  /** IDs, amounts, codes, timestamps, references. Never prose or labels. */
  | 'data-only'
  /** The above, plus source code and technical samples. */
  | 'data-and-code'
  /** No semantic restriction; monospace is a stylistic choice. */
  | 'unrestricted';

/** How space is allocated. */
export type Density =
  /** Space is earned by importance; generous spacing signals a hierarchy problem. */
  | 'high'
  /** Even, generous rhythm is the default. */
  | 'comfortable'
  /** Maximum information per viewport; spacing minimised. */
  | 'compact';

/** Contexts in which non-productive (expressive) motion is permitted. */
export type ExpressiveMotionContext =
  'onboarding' | 'empty-state' | 'transitions' | 'hover' | 'never';

/** Non-informational visuals a language permits. */
export type DecorationPolicy =
  /** Contained, clipped illustration in defined zones. Nothing else. */
  | 'illustration-contained'
  /** Illustration plus gradient/ambient treatment. */
  | 'gradient-and-illustration'
  /** No decorative visuals at all. */
  | 'none';

/** How +/- polarity (credit/debit, gain/loss) is encoded. */
export type PolarityEncoding =
  /** Weight and prominence lead; colour only reinforces inside badges. */
  | 'weight-before-color'
  /** Colour is the primary signal. */
  | 'color-led';

/** The device used to separate page sections (protocol §4). */
export type SectionRhythm = 'surface-inversion' | 'border-rule' | 'spacing-only' | 'elevation';

export interface MotionPolicy {
  /** Inclusive [min, max] duration in ms for productive motion. */
  readonly productiveRangeMs: readonly [number, number];
  /** Easing curve for productive motion. */
  readonly easing: string;
  /** Where expressive motion is allowed. `['never']` forbids it outright. */
  readonly expressiveAllowedIn: readonly ExpressiveMotionContext[];
}

/**
 * The complete set of rules a design language commits to. Every field is
 * required — a default would smuggle one language's opinion back into the
 * protocol, which is the failure this layer exists to correct.
 */
export interface DesignLanguagePolicy {
  readonly hierarchySignals: readonly HierarchySignal[];
  readonly colorRole: ColorRole;
  readonly functionalColorContainment: FunctionalColorContainment;
  readonly emphasisSurfaceBudget: EmphasisSurfaceBudget;
  readonly monospaceScope: MonospaceScope;
  readonly density: Density;
  readonly motion: MotionPolicy;
  readonly decoration: DecorationPolicy;
  readonly polarityEncoding: PolarityEncoding;
  readonly sectionRhythm: SectionRhythm;
}

export interface DesignLanguage {
  /** Must match a THEME_REGISTRY id and a [data-theme] block. */
  readonly id: string;
  /** L0 private token prefix, e.g. `--obs-`. Valid only inside this language. */
  readonly privateTokenPrefix: string;
  /** L1 contract version this language implements. */
  readonly contractVersion: string;
  readonly policy: DesignLanguagePolicy;
}

// ─── Registry ─────────────────────────────────────────────────────────────────
// `as const satisfies` rather than a type annotation: an annotation widens the
// literal types and would make DesignLanguageId resolve to `string`, so unknown
// ids would type-check. See the equivalent fix in token-contract.ts.

export const DESIGN_LANGUAGES = [
  {
    id: 'evolute',
    privateTokenPrefix: '--evo-',
    contractVersion: '1.0.0',
    policy: {
      // Deliberately opposed to obsidian on every axis, so the protocol is
      // proven against a language that did not shape it (protocol §7).
      hierarchySignals: ['weight', 'size', 'color', 'elevation', 'position'],
      colorRole: 'expressive',
      functionalColorContainment: 'surface-permitted',
      emphasisSurfaceBudget: 'unbounded',
      monospaceScope: 'data-and-code',
      density: 'comfortable',
      motion: {
        productiveRangeMs: [180, 320],
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expressiveAllowedIn: ['onboarding', 'empty-state', 'transitions', 'hover'],
      },
      decoration: 'gradient-and-illustration',
      polarityEncoding: 'color-led',
      sectionRhythm: 'elevation',
    },
  },
] as const satisfies readonly DesignLanguage[];

export type DesignLanguageId = (typeof DESIGN_LANGUAGES)[number]['id'];

export function getDesignLanguage(id: string): DesignLanguage | undefined {
  return DESIGN_LANGUAGES.find((language) => language.id === id);
}
