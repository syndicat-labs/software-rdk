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
    // Labelled "Modern"; the id stays `rdk-default` because it is also the
    // contract's reference implementation and the fallback ThemeService applies
    // when nothing is stored. Renaming the id would break both.
    id: 'rdk-default',
    privateTokenPrefix: '--rdk-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis:
        'Convention is a feature. An interface should feel immediately familiar so attention goes to the work rather than to learning the interface.',
      optimizesFor:
        'Time-to-first-competence for someone who has never seen this product but has seen a hundred like it.',
      refuses: [
        'Novelty for its own sake — an unfamiliar pattern must earn its cost in learning.',
        'Ambiguity about what is interactive; affordances look like what they do.',
        'Meaning carried by a single channel — colour always travels with a sign, icon or label.',
        'Hierarchy that only resolves at large viewport sizes.',
        'Decoration that competes with the primary action on the screen.',
      ],
      namedPatterns: [
        {
          name: 'Conventional Affordance',
          job: 'Make interactive elements recognisable without inspection',
          rule: 'A control adopts the shape users already expect; deviation requires a stated reason',
        },
        {
          name: 'Gradient Anchor',
          job: 'Mark the single most important surface on a view',
          rule: 'Brand gradient on the featured surface only — never as background texture',
        },
        {
          name: 'Soft Card',
          job: 'Separate a surface without hard division',
          rule: 'A light border plus a shallow lift; neither alone carries the separation',
        },
        {
          name: 'Signed and Coloured',
          job: 'Encode polarity so it survives without colour',
          rule: 'Colour leads, but the sign is always present — greyscale must not lose the meaning',
        },
      ],
      slotRationale: {
        colorRole:
          'Brand-led rather than expressive: colour marks action and status by convention, which is what users already read.',
        colorInHierarchy:
          'Supporting, not primary — colour reinforces a hierarchy that size and weight already establish.',
        polarityEncoding:
          'Colour-led because that is the convention for financial polarity; the Signed and Coloured pattern discharges the WCAG 1.4.1 obligation.',
        surfaceBoundary:
          'Hybrid: the Soft Card pattern uses border and lift together, since either alone reads as a stronger statement than this language wants to make.',
        typeRoleAssignment:
          'Space Grotesk gives display and headings character; Plus Jakarta Sans keeps body copy comfortable, where those same details would tire the eye.',
        emphasisSurfaceBudget:
          'Two, not one: a view may legitimately have a primary anchor and a secondary call to action without either being noise.',
        sectionRhythm:
          'Surface inversion — the Gradient Anchor is the device, so sections separate by contrast against it.',
        density:
          'Comfortable is the convention users arrive already fluent in; high density is a specialist choice.',
      },
    },
    slots: {
      surfaceBoundary: 'hybrid',
      depthModel: 'shadow',
      darkStrategy: 'single-palette',
      cornerPhilosophy: 'scaled-by-role',
      shapeCarriesBrand: false,
      colorRole: 'brand-led',
      functionalColorContainment: 'surface-permitted',
      colorInHierarchy: 'supporting',
      polarityEncoding: 'color-led',
      typeRoleAssignment: {
        display: 'Space Grotesk',
        heading: 'Space Grotesk',
        body: 'Plus Jakarta Sans',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'data-only',
      density: 'comfortable',
      spaceAllocation: 'even-rhythm',
      sectionRhythm: 'surface-inversion',
      motion: {
        productiveRangeMs: [150, 250],
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expressiveAllowedIn: ['onboarding', 'empty-state', 'transitions'],
      },
      decoration: 'gradient-and-illustration',
      emphasisSurfaceBudget: 2,
      hierarchySignals: ['size', 'weight', 'surface-contrast', 'color', 'position'],
    },
  },
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
  {
    id: 'gokul',
    privateTokenPrefix: '--gok-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis:
        'Ops as editorial — monospace truth, display scale, and ink + hairline surfaces carry hierarchy.',
      optimizesFor:
        'Scanning speed over dense operational state — the decision-critical figure finds the eye before anything else.',
      refuses: [
        'Colour as a hierarchy channel — status colour is a signal, never a rank.',
        'Lift and shadow on data surfaces — separation is ink tone and hairline; depth belongs to chrome.',
        'Round geometry on data — the terminal and the print column share square corners.',
        'Decorative motion in operant surfaces — the grid does not dance.',
        'Ornament that competes with the display figure — the number is the art.',
      ],
      namedPatterns: [
        {
          name: 'Hairline Rule',
          job: 'Separate surfaces and sections without weight',
          rule: 'A true-colour hairline; a heavier rule means a real boundary',
        },
        {
          name: 'Ink Well',
          job: 'Make the canvas recede so the figure advances',
          rule: 'Base surface is ink; lifted paper is reserved for the featured figure, never ordinary panels',
        },
        {
          name: 'Display Figure',
          job: 'Surface the decision-critical number at display scale',
          rule: 'Exactly one per view, lightest ink on the darkest ground, inheriting no colour',
        },
        {
          name: 'Monospace Truth',
          job: 'Mark machine-generated values at a glance',
          rule: 'Quantities, IDs, timestamps, diffs and query material in mono; prose never',
        },
        {
          name: 'Status Ink',
          job: 'Convey state without carrying hierarchy',
          rule: 'Functional colour confined to badges; a status never becomes a layout',
        },
      ],
      slotRationale: {
        surfaceBoundary:
          'The Hairline Rule is the publication grid — surfaces separate by stroke (border), not by lift.',
        depthModel:
          'Flat: a print grid has no third dimension; shadow would import application chrome.',
        colorInHierarchy:
          'Direct restatement of the thesis — the Display Figure and hairlines carry rank; colour is status ink only.',
        emphasisSurfaceBudget: 'One Display Figure per view; a second is a conflict in the grid.',
        density:
          'Ops density is earned — compact rows fit more state; generous space explicitly signals importance.',
        sectionRhythm: 'Hairlines divide sections; the rule is the grid punctuation.',
        polarityEncoding:
          'Weight before colour — a ledger reads by weight; colour confirms, never leads.',
        typeRoleAssignment:
          'A heavy grotesque masthead carries display scale; Inter is the neutral wire between data; JetBrains Mono states the figures.',
        cornerPhilosophy: 'Square corners match both lineages — the terminal and the print column.',
        spaceAllocation:
          'Earned by importance — the Display Figure owns the space; supporting rows recede.',
        monospaceScope:
          'Data and code read as truth — the scope runs to query and log material, never prose.',
      },
    },
    slots: {
      surfaceBoundary: 'border',
      depthModel: 'flat',
      darkStrategy: 'single-palette',
      cornerPhilosophy: 'square',
      shapeCarriesBrand: false,
      colorRole: 'functional-only',
      functionalColorContainment: 'badge-only',
      colorInHierarchy: 'excluded',
      polarityEncoding: 'weight-before-color',
      typeRoleAssignment: {
        display: 'Montserrat',
        heading: 'Inter',
        body: 'Inter',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'data-and-code',
      density: 'high',
      spaceAllocation: 'earned-by-importance',
      sectionRhythm: 'border-rule',
      motion: {
        productiveRangeMs: [100, 200],
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expressiveAllowedIn: ['never'],
      },
      decoration: 'none',
      emphasisSurfaceBudget: 1,
      hierarchySignals: ['size', 'position', 'weight', 'surface-contrast', 'opacity'],
    },
  },
  {
    id: 'paper',
    privateTokenPrefix: '--oh-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis: 'Warm paper before screen; acid-yellow highlight on newsprint.',
      optimizesFor:
        'Sustained reading on warm paper — hierarchy is typographic, the highlight marks the one thing to act on.',
      refuses: [
        'Cool grey screens — paper is warm or it is blank.',
        'Translucency and glass — a print surface does not blur.',
        'Colour as a hierarchy channel — rank lives in ink weight, type scale and column position.',
        'Decorative illustration — the highlight marks, the rule divides, nothing else ornaments.',
        'Surface lift as a rank signal — cards floating off the page are application chrome.',
      ],
      namedPatterns: [
        {
          name: 'Highlighter Mark',
          job: 'Mark the single featured element without breaking the page',
          rule: 'Acid-yellow on the one featured surface per view; never used as decoration elsewhere',
        },
        {
          name: 'Newsprint Column',
          job: 'Divide sections the way a broadsheet does',
          rule: 'Hairline rules; spacing carries the primary rhythm, the rule is punctuation',
        },
        {
          name: 'Headline Scale',
          job: 'Rank by type, not by colour',
          rule: 'The headline is the loudest object; nothing coloured competes with it',
        },
        {
          name: 'Ink Accounting',
          job: 'Keep financial polarity readable without colour',
          rule: 'Figures set in mono; credits bold, debits regular — weight before colour',
        },
      ],
      slotRationale: {
        surfaceBoundary:
          'Border — a sheet separates by rule, not by lift; a shadow would make cards hover off the paper.',
        depthModel: 'Flat — paper layers are adjacent, never stacked.',
        darkStrategy:
          'Separate palettes — the night page is an authored world (noir), not an inversion of this one.',
        colorRole: 'Brand-led — the acid yellow is the signature; nothing else shares the hue.',
        colorInHierarchy:
          'Supporting — the headline scale already ranks; the highlight confirms the one featured element.',
        emphasisSurfaceBudget: 'One Highlighter Mark per view; a second mark stops being a mark.',
        sectionRhythm: 'Border rule — the Newsprint Column is this language rhythm device.',
        typeRoleAssignment:
          'Montserrat at masthead weight with Plus Jakarta Sans prose reads as a designed newspaper, not an application.',
        cornerPhilosophy:
          'Uniform, small corners read like print stock; square would fight the paper warmth.',
        polarityEncoding:
          'Weight before colour — Ink Accounting makes greyscale legible by construction.',
      },
    },
    slots: {
      surfaceBoundary: 'border',
      depthModel: 'flat',
      darkStrategy: 'separate-palette',
      cornerPhilosophy: 'uniform',
      shapeCarriesBrand: false,
      colorRole: 'brand-led',
      functionalColorContainment: 'badge-only',
      colorInHierarchy: 'supporting',
      polarityEncoding: 'weight-before-color',
      typeRoleAssignment: {
        display: 'Montserrat',
        heading: 'Montserrat',
        body: 'Plus Jakarta Sans',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'data-only',
      density: 'comfortable',
      spaceAllocation: 'even-rhythm',
      sectionRhythm: 'border-rule',
      motion: {
        productiveRangeMs: [150, 250],
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expressiveAllowedIn: ['never'],
      },
      decoration: 'none',
      emphasisSurfaceBudget: 1,
      hierarchySignals: ['size', 'position', 'weight', 'surface-contrast', 'opacity'],
    },
  },
  {
    // Variant of paper (registry: noir.variantOf = paper). Night reading:
    // warm-desaturated, the acid-yellow accent collapses to white, paper layers
    // remain. Shares the --oh-* namespace with its parent per protocol §7.
    id: 'noir',
    privateTokenPrefix: '--oh-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis:
        'Reading at night — warm desaturated, accent collapses to white, paper layers remain.',
      optimizesFor:
        'Comfortable legibility for long night sessions, without gamut and without glare.',
      refuses: [
        'High-glare pure white — paper stays warm paper.',
        'A brand accent — at night the highlight is white, not acid-yellow.',
        'Cool blue shift — the night page is warm; it does not turn the interface blue.',
        'Brightly saturated surfaces — the night page is warm-desaturated.',
      ],
      namedPatterns: [
        {
          name: 'Warm Night Ground',
          job: 'Reduce glare while staying warm',
          rule: 'Base is a warm ink; surfaces step up one tone at a time, never to pure black',
        },
        {
          name: 'White Highlighter',
          job: 'Keep the paper emphasis language when the accent is gone',
          rule: 'The featured element is warm-white on warm-ink; no hue is allowed back',
        },
        {
          name: 'Headline Scale (shared)',
          job: 'Keep hierarchy typographic once colour collapses',
          rule: 'Rank stays in ink weight, type scale and position — colour never returns to hierarchy',
        },
        {
          name: 'Ink Accounting (shared)',
          job: 'Keep polarity legible in monochrome',
          rule: 'Figures in mono; weight before colour, exactly as on paper',
        },
      ],
      slotRationale: {
        darkStrategy:
          'Noir owns the night — its palette is its own construction, not an inversion routine over paper.',
        colorRole:
          'Functional-only — once the accent collapses to white there is no brand hue left to carry.',
        colorInHierarchy:
          'Excluded — this is the paper hierarchy left after the highlight collapses.',
        surfaceBoundary: 'Border — paper layers remain: sheets still separate by rule at night.',
        sectionRhythm: 'Border rule — the Newsprint Column carries into the dark, unchanged.',
        typeRoleAssignment:
          'Faces are inherited from paper; the night deviation lives in surfaces, not in type.',
        emphasisSurfaceBudget: 'One White Highlighter per view, as on paper.',
        density: 'Inherited from paper — even night rhythm, no compaction of furniture.',
      },
    },
    slots: {
      surfaceBoundary: 'border',
      depthModel: 'flat',
      darkStrategy: 'single-palette',
      cornerPhilosophy: 'uniform',
      shapeCarriesBrand: false,
      colorRole: 'functional-only',
      functionalColorContainment: 'badge-only',
      colorInHierarchy: 'excluded',
      polarityEncoding: 'weight-before-color',
      typeRoleAssignment: {
        display: 'Montserrat',
        heading: 'Montserrat',
        body: 'Plus Jakarta Sans',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'data-only',
      density: 'comfortable',
      spaceAllocation: 'even-rhythm',
      sectionRhythm: 'border-rule',
      motion: {
        productiveRangeMs: [150, 250],
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expressiveAllowedIn: ['never'],
      },
      decoration: 'none',
      emphasisSurfaceBudget: 1,
      hierarchySignals: ['size', 'position', 'weight', 'surface-contrast', 'opacity'],
    },
  },
  {
    // Variant of obsidian (registry: launchline-obsidian.variantOf = obsidian).
    // Terminal/deck showcase: shares --obs-*; mono becomes the interface voice,
    // density tightens, and the display resets to the prompt.
    id: 'launchline-obsidian',
    privateTokenPrefix: '--obs-',
    contractVersion: '1.1.0',
    protocolVersion: PROTOCOL_VERSION,
    philosophy: {
      thesis: 'Restraint as law; hierarchy without colour (launchline terminal/deck showcase).',
      optimizesFor:
        'Runway clarity — a launch deck that reads like a terminal: every state explicit, nothing animated.',
      refuses: [
        'Colour as a hierarchy channel — the deck is monochrome discipline (inherited).',
        'Decorative motion — the deck cuts, it does not animate.',
        'Illustration anywhere — a terminal carries no illustration; decoration is typographic only.',
        'Prose that hides its tabular read — data rows stay aligned and mono.',
        'Ambiguous affordances on a deck — every prompt is a command.',
      ],
      namedPatterns: [
        {
          name: 'Terminal Echo',
          job: 'Make the interface speak in the same voice as data',
          rule: 'Prompts, output and numerals are monospaced; prose stays proportional',
        },
        {
          name: 'Prompt Line',
          job: 'Mark state the way a shell marks the current line',
          rule: 'The active item is weighted and offset, never coloured',
        },
        {
          name: 'Deck Cut',
          job: 'Change state by replacement, not transition',
          rule: 'No animated section change — cuts only, in both motion policy and decoration',
        },
        {
          name: 'Dark Card Anchor (inherited)',
          job: 'Pin the decision-critical figure',
          rule: 'Exactly one per layout; two competing is a structural error',
        },
      ],
      slotRationale: {
        monospaceScope:
          'Unrestricted — the terminal is the interface: prompt, output and data share one voice.',
        density:
          'Compact — a deck fits more runway per screen; the inherited Dark Card Anchor still holds.',
        typeRoleAssignment:
          'JetBrains Mono at display scale resets the deck to the prompt — the loudest object is the cursor of the launch.',
        decoration:
          'None — a terminal carries no illustration, and the Deck Cut bans expressive state changes.',
        colorInHierarchy:
          'Inherited from obsidian — structure carries hierarchy; colour is status ink in badges only.',
        emphasisSurfaceBudget: 'Inherited — one Dark Card Anchor per view.',
        motion: 'Never expressive — a deck cuts; motion would be hierarchy by other means.',
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
        display: 'JetBrains Mono',
        heading: 'Inter',
        body: 'Inter',
        data: 'JetBrains Mono',
      },
      monospaceScope: 'unrestricted',
      density: 'compact',
      spaceAllocation: 'earned-by-importance',
      sectionRhythm: 'surface-inversion',
      motion: {
        productiveRangeMs: [150, 250],
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        expressiveAllowedIn: ['never'],
      },
      decoration: 'none',
      emphasisSurfaceBudget: 1,
      hierarchySignals: ['weight', 'size', 'surface-contrast', 'position', 'opacity'],
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
