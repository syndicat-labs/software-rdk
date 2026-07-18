import {
  DESIGN_LANGUAGES,
  PROTOCOL_VERSION,
  getDesignLanguage,
  type DesignLanguagePolicy,
} from './design-language';
import { CONTRACT_VERSION, THEME_REGISTRY } from './token-contract';

// Runtime mirror of the static checks in scripts/check-theme-contract.mjs.
// The script guards the source tree; these guard the shipped bundle, so a
// language cannot reach production with an incomplete policy even if the gate
// is bypassed.
const REQUIRED_POLICY_KEYS: readonly (keyof DesignLanguagePolicy)[] = [
  'hierarchySignals',
  'colorRole',
  'functionalColorContainment',
  'emphasisSurfaceBudget',
  'monospaceScope',
  'density',
  'motion',
  'decoration',
  'polarityEncoding',
  'sectionRhythm',
];

describe('design language protocol', () => {
  describe('getDesignLanguage', () => {
    it('returns the language for a registered id', () => {
      const language = getDesignLanguage('evolute');
      expect(language).toBeDefined();
      expect(language?.id).toBe('evolute');
    });

    it('returns undefined for an unregistered id', () => {
      expect(getDesignLanguage('not-a-language')).toBeUndefined();
    });

    it('returns undefined for an empty id', () => {
      expect(getDesignLanguage('')).toBeUndefined();
    });
  });

  describe('registry integrity', () => {
    it('declares at least one language', () => {
      expect(DESIGN_LANGUAGES.length).toBeGreaterThan(0);
    });

    it('has no duplicate ids', () => {
      const ids = DESIGN_LANGUAGES.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it.each(DESIGN_LANGUAGES.map((l) => [l.id, l] as const))(
      '%s answers every policy dimension',
      (_id, language) => {
        for (const key of REQUIRED_POLICY_KEYS) {
          expect(language.policy[key]).toBeDefined();
        }
      },
    );

    it.each(DESIGN_LANGUAGES.map((l) => [l.id, l] as const))(
      '%s is registered as a theme',
      (id, _language) => {
        expect(THEME_REGISTRY.some((theme) => theme.id === id)).toBe(true);
      },
    );

    it.each(DESIGN_LANGUAGES.map((l) => [l.id, l] as const))(
      '%s implements the current contract version',
      (_id, language) => {
        expect(language.contractVersion).toBe(CONTRACT_VERSION);
      },
    );

    it.each(DESIGN_LANGUAGES.map((l) => [l.id, l] as const))(
      '%s declares a private token prefix that is not the shared contract namespace',
      (_id, language) => {
        expect(language.privateTokenPrefix).toMatch(/^--[a-z]+-$/);
        // L0 prefixes must not collide with L1 namespaces, or a language's
        // private tokens would shadow contract tokens components rely on.
        expect(['--color-', '--space-', '--radius-', '--font-']).not.toContain(
          language.privateTokenPrefix,
        );
      },
    );

    it.each(DESIGN_LANGUAGES.map((l) => [l.id, l] as const))(
      '%s declares a coherent productive motion range',
      (_id, language) => {
        const [min, max] = language.policy.motion.productiveRangeMs;
        expect(min).toBeGreaterThan(0);
        expect(max).toBeGreaterThanOrEqual(min);
      },
    );

    it('exposes a protocol version', () => {
      expect(PROTOCOL_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('theEvolute', () => {
    // theEvolute exists to prove the protocol is language-agnostic. If it ever
    // agrees with Obsidian on these axes it has stopped doing that job, and the
    // protocol is no longer demonstrated by anything.
    const evolute = getDesignLanguage('evolute');

    it('permits colour to carry hierarchy', () => {
      expect(evolute?.policy.hierarchySignals).toContain('color');
      expect(evolute?.policy.colorRole).toBe('expressive');
    });

    it('does not constrain emphasis surfaces to a single anchor', () => {
      expect(evolute?.policy.emphasisSurfaceBudget).toBe('unbounded');
    });

    it('separates sections by elevation rather than surface inversion', () => {
      expect(evolute?.policy.sectionRhythm).toBe('elevation');
    });
  });
});
