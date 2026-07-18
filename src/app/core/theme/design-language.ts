// ─── Design Language Protocol — agnostics ─────────────────────────────────────
// Canonical protocol: /home/cain/Claude files/design-language-protocol.md
//
// Machine law is one sentence: all design languages obey the established
// contracts to be accepted as valid theming contracts. Law hardcodes no values —
// it defines the SLOTS every language must fill. Languages answer them in their
// own philosophies and pass the gates.
//
// A slot exists only where established design languages demonstrably differ
// (Material 3, Carbon, Polaris, Fluent, Atlassian). Where they converge, or an
// external standard is normative, it is law and is not answerable here. The
// decisive case: Material 3 ships cards as elevated | filled | outlined and asks
// designers to choose — a question a system answers plurally within itself
// cannot be machine law.
//
// Every field is required. Silence is not an answer: an unanswered slot becomes
// an implicit default, which is how one language's opinion silently becomes the
// system's.
//
// Protocol version: 1.0.0 — 18 slots, closed. Adding a slot is a MAJOR bump and
// every registered language must re-answer before it ships.

export const PROTOCOL_VERSION = '1.0.0';
export const PROTOCOL_SLOT_COUNT = 18;

// ─── A · Surface & depth ──────────────────────────────────────────────────────
export type SurfaceBoundary = 'border' | 'elevation' | 'fill' | 'none' | 'hybrid';
export type DepthModel = 'shadow' | 'surface-tint' | 'border-weight' | 'layer-token' | 'flat';
export type DarkStrategy =
  'separate-palette' | 'tint-inversion' | 'elevation-tint' | 'single-palette';

// ─── B · Shape ────────────────────────────────────────────────────────────────
export type CornerPhilosophy = 'uniform' | 'scaled-by-role' | 'expressive-mixed' | 'square';

// ─── C · Colour ───────────────────────────────────────────────────────────────
export type ColorRole = 'functional-only' | 'expressive' | 'brand-led' | 'generative';
export type FunctionalColorContainment = 'badge-only' | 'surface-permitted' | 'unrestricted';
export type ColorInHierarchy = 'excluded' | 'supporting' | 'primary';
export type PolarityEncoding = 'weight-before-color' | 'color-led' | 'icon-led';

// ─── D · Typography ───────────────────────────────────────────────────────────
export interface TypeRoleAssignment {
  readonly display: string;
  readonly heading: string;
  readonly body: string;
  readonly data: string;
}
export type MonospaceScope = 'data-only' | 'data-and-code' | 'unrestricted';

// ─── E · Space ────────────────────────────────────────────────────────────────
export type Density = 'high' | 'comfortable' | 'compact' | 'adaptive';
export type SpaceAllocation = 'earned-by-importance' | 'even-rhythm';
export type SectionRhythm = 'surface-inversion' | 'border-rule' | 'spacing-only' | 'elevation';

// ─── F · Motion ───────────────────────────────────────────────────────────────
export type ExpressiveMotionContext =
  'onboarding' | 'empty-state' | 'transitions' | 'hover' | 'never';

export interface MotionPolicy {
  /** Inclusive [min, max] ms for productive motion. */
  readonly productiveRangeMs: readonly [number, number];
  readonly easing: string;
  /** `['never']` forbids expressive motion outright. */
  readonly expressiveAllowedIn: readonly ExpressiveMotionContext[];
}

// ─── G · Ornament & emphasis ──────────────────────────────────────────────────
export type DecorationPolicy =
  'none' | 'illustration-contained' | 'gradient-and-illustration' | 'unrestricted';
export type EmphasisSurfaceBudget = 1 | 2 | 'unbounded';
export type HierarchySignal =
  'weight' | 'size' | 'surface-contrast' | 'position' | 'opacity' | 'color' | 'elevation';

/** The 18 agnostic slots. Closed set; every field required. */
export interface SlotAnswers {
  readonly surfaceBoundary: SurfaceBoundary;
  readonly depthModel: DepthModel;
  readonly darkStrategy: DarkStrategy;
  readonly cornerPhilosophy: CornerPhilosophy;
  readonly shapeCarriesBrand: boolean;
  readonly colorRole: ColorRole;
  readonly functionalColorContainment: FunctionalColorContainment;
  readonly colorInHierarchy: ColorInHierarchy;
  readonly polarityEncoding: PolarityEncoding;
  readonly typeRoleAssignment: TypeRoleAssignment;
  readonly monospaceScope: MonospaceScope;
  readonly density: Density;
  readonly spaceAllocation: SpaceAllocation;
  readonly sectionRhythm: SectionRhythm;
  readonly motion: MotionPolicy;
  readonly decoration: DecorationPolicy;
  readonly emphasisSurfaceBudget: EmphasisSurfaceBudget;
  /** Ordered by read speed under this language's thesis. */
  readonly hierarchySignals: readonly HierarchySignal[];
}

/** A signature structural pattern: a name, the job it does, and its rule. */
export interface NamedPattern {
  readonly name: string;
  readonly job: string;
  readonly rule: string;
}

/**
 * Machine root defines the SHAPE of a philosophy, never its content.
 * `refuses` and `slotRationale` are what make a language a paradigm rather than
 * a palette — a language whose answers do not follow from its thesis is a
 * collection of preferences.
 */
export interface Philosophy {
  readonly thesis: string;
  readonly optimizesFor: string;
  readonly refuses: readonly string[];
  readonly namedPatterns: readonly NamedPattern[];
  /** Slot name → why that answer follows from the thesis. */
  readonly slotRationale: Readonly<Record<string, string>>;
}

export interface DesignLanguage {
  readonly id: string;
  /** L0 private prefix. Valid only inside this language's own block. */
  readonly privateTokenPrefix: string;
  readonly contractVersion: string;
  readonly protocolVersion: string;
  readonly philosophy: Philosophy;
  readonly slots: SlotAnswers;
}

// ─── Registry ─────────────────────────────────────────────────────────────────
// `as const satisfies` — a `: readonly DesignLanguage[]` annotation widens the
// literals, silently discards `as const`, and leaves the id type as `string`, so
// every unknown id type-checks. See the same fix in token-contract.ts.

export const DESIGN_LANGUAGES = [
  {
    id: 'obsidian',
    privateTokenPrefix: '--obs-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis:
        'Restraint is a law. Hierarchy is solved at the structure level, so colour is freed to carry only meaning.',
      optimizesFor: 'Sustained legibility under dense, repeated, decision-critical use.',
      refuses: [
        'Colour as a hierarchy channel — reaching for colour signals a structural problem.',
        'More than one emphasis surface competing in a layout.',
        'Decorative motion inside task flows.',
        'Decoration that is not contained illustration.',
        'Monospace on prose — it would stop signalling machine data.',
      ],
      namedPatterns: [
        {
          name: 'Dark Card Anchor',
          job: 'Anchor the single most decision-critical value in a layout',
          rule: 'Exactly one per layout; two competing is a structural error',
        },
        {
          name: 'Monospace as Semantic Signal',
          job: 'Mark machine-generated data at a glance',
          rule: 'IDs, amounts, codes, timestamps, references only — never prose or labels',
        },
        {
          name: 'Functional Colour Containment',
          job: 'Keep semantic colour readable and non-hierarchical',
          rule: 'Inside pill badges only; never surfaces, rows or body text',
        },
        {
          name: 'Financial Polarity Without Colour',
          job: 'Encode credit/debit so colourblind users read it unaided',
          rule: 'Credits bold + primary, debits regular + muted; colour reinforces, never leads',
        },
      ],
      slotRationale: {
        colorInHierarchy: 'Direct restatement of the thesis — structure carries hierarchy.',
        emphasisSurfaceBudget: 'The Dark Card Anchor is meaningless if anything else competes.',
        density: 'Space is earned by importance; generous spacing signals a hierarchy problem.',
        sectionRhythm: 'Light/dark duality is the primary structural tool, so inversion is free.',
        monospaceScope: 'Mono is a semantic signal; widening its scope destroys the signal.',
      },
    },
    slots: {
      surfaceBoundary: 'hybrid',
      depthModel: 'shadow',
      darkStrategy: 'single-palette',
      cornerPhilosophy: 'uniform',
      shapeCarriesBrand: false,
      colorRole: 'functional-only',
      functionalColorContainment: 'badge-only',
      colorInHierarchy: 'excluded',
      polarityEncoding: 'weight-before-color',
      typeRoleAssignment: {
        display: 'Inter',
        heading: 'Montserrat',
        body: 'Inter',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'data-only',
      density: 'high',
      spaceAllocation: 'earned-by-importance',
      sectionRhythm: 'surface-inversion',
      motion: {
        productiveRangeMs: [150, 250],
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expressiveAllowedIn: ['onboarding', 'empty-state'],
      },
      decoration: 'illustration-contained',
      emphasisSurfaceBudget: 1,
      hierarchySignals: ['weight', 'size', 'surface-contrast', 'position', 'opacity'],
    },
  },
  {
    id: 'evolute',
    privateTokenPrefix: '--evo-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis: 'Light and colour are how meaning arrives. Structure should feel grown, not carved.',
      optimizesFor:
        'Time-to-comprehension on unfamiliar screens — colour and elevation partition a view before reading begins.',
      refuses: [
        'Colour without a redundant cue — colour that cannot survive greyscale is decoration.',
        'Manufacturing importance with a single anchor; three priorities are shown as three.',
        'Gradient as filler — gradient encodes depth or progression or it is banned.',
        'Surface inversion for rhythm; inversion is reserved for genuine mode changes.',
        'Buying density with legibility.',
      ],
      namedPatterns: [
        {
          name: 'Lift Ladder',
          job: 'Convey grouping and priority through stacked elevation',
          rule: 'Max three elevation steps per view; a step must mean a rank change',
        },
        {
          name: 'Chromatic Key',
          job: 'Assign a hue to a recurring domain entity for pre-attentive recognition',
          rule: 'A hue, once assigned, is never reused for another entity in the same product',
        },
        {
          name: 'Gradient as Vector',
          job: 'Encode progression — time, completion, flow — through gradient direction',
          rule: 'Static gradients only on featured surfaces; elsewhere direction must mean something',
        },
        {
          name: 'Redundant Signal',
          job: 'Keep colour-carried meaning legible without colour',
          rule: 'Greyscale test — if meaning is lost, the pattern is broken',
        },
        {
          name: 'Warm Ground',
          job: 'Make chromatic accents read as intentional',
          rule: 'Never a cool grey ground under a warm accent',
        },
      ],
      slotRationale: {
        surfaceBoundary:
          'Grown, not carved — a lifted plane reads as an object, a stroke reads as a cut.',
        colorInHierarchy: 'Direct restatement of the thesis.',
        polarityEncoding: 'Fastest read for +/-; valid only because Redundant Signal is mandatory.',
        cornerPhilosophy:
          'Radius grows with surface rank, reinforcing the Lift Ladder. Mixed radii would compete with elevation as a rank signal.',
        shapeCarriesBrand:
          'Colour and light carry identity; shape doing so too would double-encode and dilute both.',
        typeRoleAssignment:
          'One humanist family across prose roles — type is not a differentiating channel here, so it stays quiet.',
        spaceAllocation:
          'Predictable rhythm lets colour and elevation carry the variance; two variance channels produce noise.',
        density:
          'Elevation needs shadow room; high density collapses the Lift Ladder into flatness.',
        motion:
          'A decelerating curve reads as settling into place. Hover is included or elevation looks painted on.',
        decoration: 'Gradient as Vector is a named pattern, so gradient must be permitted.',
        emphasisSurfaceBudget:
          'A fixed budget forces false single-focus on views with several genuine priorities.',
      },
    },
    slots: {
      surfaceBoundary: 'elevation',
      depthModel: 'shadow',
      darkStrategy: 'separate-palette',
      cornerPhilosophy: 'scaled-by-role',
      shapeCarriesBrand: false,
      colorRole: 'expressive',
      functionalColorContainment: 'surface-permitted',
      colorInHierarchy: 'primary',
      polarityEncoding: 'color-led',
      typeRoleAssignment: {
        display: 'Inter',
        heading: 'Inter',
        body: 'Inter',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'data-and-code',
      density: 'comfortable',
      spaceAllocation: 'even-rhythm',
      sectionRhythm: 'elevation',
      motion: {
        productiveRangeMs: [180, 320],
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        expressiveAllowedIn: ['onboarding', 'empty-state', 'transitions', 'hover'],
      },
      decoration: 'gradient-and-illustration',
      emphasisSurfaceBudget: 'unbounded',
      hierarchySignals: ['color', 'elevation', 'size', 'weight', 'position'],
    },
  },
] as const satisfies readonly DesignLanguage[];

export type DesignLanguageId = (typeof DESIGN_LANGUAGES)[number]['id'];

export function getDesignLanguage(id: string): DesignLanguage | undefined {
  return DESIGN_LANGUAGES.find((language) => language.id === id);
}

/**
 * Languages making colour load-bearing are permitted by WCAG 2.2 §1.4.1 only
 * alongside a non-colour cue. The protocol's accessibility floor bounds the slot
 * space, so such a language must name the pattern that discharges the obligation.
 */
export function requiresRedundantColorCue(language: DesignLanguage): boolean {
  return (
    language.slots.polarityEncoding === 'color-led' ||
    language.slots.colorInHierarchy === 'primary' ||
    language.slots.colorRole === 'expressive'
  );
}
