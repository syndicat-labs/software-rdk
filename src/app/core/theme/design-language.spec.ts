import {
  DESIGN_LANGUAGES,
  PROTOCOL_SLOT_COUNT,
  PROTOCOL_VERSION,
  getDesignLanguage,
  requiresRedundantColorCue,
  type SlotAnswers,
  type Philosophy,
} from './design-language';
import { CONTRACT_VERSION, THEME_REGISTRY } from './token-contract';

// Runtime mirror of the static checks in scripts/check-theme-contract.mjs. The
// script guards the source tree; these guard the shipped bundle, so a language
// cannot reach production incompletely declared even if the gate is bypassed.
const REQUIRED_SLOTS: readonly (keyof SlotAnswers)[] = [
  'surfaceBoundary',
  'depthModel',
  'darkStrategy',
  'cornerPhilosophy',
  'shapeCarriesBrand',
  'colorRole',
  'functionalColorContainment',
  'colorInHierarchy',
  'polarityEncoding',
  'typeRoleAssignment',
  'monospaceScope',
  'density',
  'spaceAllocation',
  'sectionRhythm',
  'motion',
  'decoration',
  'emphasisSurfaceBudget',
  'hierarchySignals',
];

const REQUIRED_PHILOSOPHY: readonly (keyof Philosophy)[] = [
  'thesis',
  'optimizesFor',
  'refuses',
  'namedPatterns',
  'slotRationale',
];

const each = DESIGN_LANGUAGES.map((l) => [l.id, l] as const);

describe('design language protocol', () => {
  describe('getDesignLanguage', () => {
    it('returns a registered language', () => {
      expect(getDesignLanguage('evolute')?.id).toBe('evolute');
    });

    it('returns undefined for an unregistered id', () => {
      expect(getDesignLanguage('not-a-language')).toBeUndefined();
    });

    it('returns undefined for an empty id', () => {
      expect(getDesignLanguage('')).toBeUndefined();
    });
  });

  describe('protocol invariants', () => {
    it('declares the closed slot count', () => {
      expect(PROTOCOL_SLOT_COUNT).toBe(REQUIRED_SLOTS.length);
    });

    it('exposes a semver protocol version', () => {
      expect(PROTOCOL_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('has no duplicate language ids', () => {
      const ids = DESIGN_LANGUAGES.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe.each(each)('%s', (id, language) => {
    it('answers all 18 slots — silence is not an answer', () => {
      for (const slot of REQUIRED_SLOTS) {
        expect(language.slots[slot]).toBeDefined();
      }
    });

    it('declares a complete philosophy', () => {
      for (const field of REQUIRED_PHILOSOPHY) {
        expect(language.philosophy[field]).toBeDefined();
      }
    });

    it('states what it refuses — the negative space is the identity', () => {
      expect(language.philosophy.refuses.length).toBeGreaterThan(0);
    });

    it('names structural patterns with a job and a rule', () => {
      expect(language.philosophy.namedPatterns.length).toBeGreaterThan(0);
      for (const pattern of language.philosophy.namedPatterns) {
        expect(pattern.name).toBeTruthy();
        expect(pattern.job).toBeTruthy();
        expect(pattern.rule).toBeTruthy();
      }
    });

    it('ties slot answers back to its thesis', () => {
      // A language whose answers do not follow from its thesis is a collection
      // of preferences, not a paradigm.
      const rationaleKeys = Object.keys(language.philosophy.slotRationale);
      expect(rationaleKeys.length).toBeGreaterThan(0);
      for (const key of rationaleKeys) {
        expect(REQUIRED_SLOTS).toContain(key as keyof SlotAnswers);
      }
    });

    it('is registered as a theme', () => {
      expect(THEME_REGISTRY.some((theme) => theme.id === id)).toBe(true);
    });

    it('implements the current contract and protocol versions', () => {
      expect(language.contractVersion).toBe(CONTRACT_VERSION);
      expect(language.protocolVersion).toBe(PROTOCOL_VERSION);
    });

    it('owns a private prefix that cannot shadow a shared namespace', () => {
      expect(language.privateTokenPrefix).toMatch(/^--[a-z]+-$/);
      expect(['--color-', '--space-', '--radius-', '--font-']).not.toContain(
        language.privateTokenPrefix,
      );
    });

    it('declares a coherent productive motion range', () => {
      const [min, max] = language.slots.motion.productiveRangeMs;
      expect(min).toBeGreaterThan(0);
      expect(max).toBeGreaterThanOrEqual(min);
    });

    it('discharges the WCAG 1.4.1 obligation if colour is load-bearing', () => {
      // The accessibility floor BOUNDS the slot space: a language may answer
      // color-led / primary only where a non-colour cue co-exists. It must name
      // the pattern that discharges that obligation.
      if (!requiresRedundantColorCue(language)) return;
      const patterns = language.philosophy.namedPatterns;
      const hasRedundancyPattern = patterns.some((p) =>
        /redundan|greyscale|grayscale|non-colour|non-color/i.test(`${p.name} ${p.job} ${p.rule}`),
      );
      expect(hasRedundancyPattern).toBe(true);
    });
  });

  describe('the protocol is language-agnostic', () => {
    // If the two registered languages ever converge on these axes, the protocol
    // is no longer demonstrated by anything in the repository.
    const obsidian = getDesignLanguage('obsidian');
    const evolute = getDesignLanguage('evolute');

    it('registers two languages that genuinely disagree', () => {
      expect(obsidian).toBeDefined();
      expect(evolute).toBeDefined();
      const contested: (keyof SlotAnswers)[] = [
        'surfaceBoundary',
        'colorRole',
        'colorInHierarchy',
        'polarityEncoding',
        'density',
        'sectionRhythm',
        'decoration',
        'emphasisSurfaceBudget',
      ];
      for (const slot of contested) {
        expect(obsidian!.slots[slot]).not.toEqual(evolute!.slots[slot]);
      }
    });

    it('lets colour be excluded from hierarchy in one language and primary in another', () => {
      expect(obsidian!.slots.colorInHierarchy).toBe('excluded');
      expect(evolute!.slots.colorInHierarchy).toBe('primary');
    });

    it('does not force a shared motion budget', () => {
      expect(obsidian!.slots.motion.productiveRangeMs).not.toEqual(
        evolute!.slots.motion.productiveRangeMs,
      );
    });
  });
});
