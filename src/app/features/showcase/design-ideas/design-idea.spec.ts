import { DESIGN_IDEAS, getDesignIdea, getVariant } from './design-idea';
import { THEME_REGISTRY } from '../../../core/theme/token-contract';

/**
 * The registry maps ideas to lazily-imported components. Nothing else verifies
 * those imports resolve: a typo in a path, or a component renamed without
 * updating the registry, currently surfaces only when a human navigates to that
 * idea under that language. These tests execute every `load()` so a broken
 * variant fails CI instead of waiting to be stumbled upon.
 */
describe('design idea registry', () => {
  it('registers at least one idea', () => {
    expect(DESIGN_IDEAS.length).toBeGreaterThan(0);
  });

  it('has no duplicate idea ids', () => {
    const ids = DESIGN_IDEAS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  describe.each(DESIGN_IDEAS.map((i) => [i.id, i] as const))('%s', (id, idea) => {
    it('states a brief', () => {
      expect(idea.brief.trim().length).toBeGreaterThan(0);
    });

    it('declares at least one variant', () => {
      expect(idea.variants.length).toBeGreaterThan(0);
    });

    it('has no duplicate language among its variants', () => {
      const langs = idea.variants.map((v) => v.language);
      expect(new Set(langs).size).toBe(langs.length);
    });

    it('names only registered languages', () => {
      for (const variant of idea.variants) {
        expect(THEME_REGISTRY.some((t) => t.id === variant.language)).toBe(true);
      }
    });

    it('states what each variant emphasises', () => {
      // The emphasis is what distinguishes a language's take from a re-skin. A
      // variant that cannot say how it differs probably does not.
      for (const variant of idea.variants) {
        expect(variant.emphasis.trim().length).toBeGreaterThan(0);
      }
    });

    it('is retrievable by id', () => {
      expect(getDesignIdea(id)).toBe(idea);
    });

    // The point of this file: prove the lazy imports actually resolve.
    it.each(idea.variants.map((v) => [v.language, v] as const))(
      'variant %s loads a component',
      async (_language, variant) => {
        const component = await variant.load();
        expect(component).toBeDefined();
        expect(typeof component).toBe('function');
      },
    );
  });

  describe('lookup', () => {
    it('returns undefined for an unregistered idea', () => {
      expect(getDesignIdea('not-an-idea')).toBeUndefined();
    });

    it('returns undefined for an empty id', () => {
      expect(getDesignIdea('')).toBeUndefined();
    });

    it('returns undefined when a language has no variant for an idea', () => {
      // The gap state depends on this returning undefined rather than falling
      // back to another language's work.
      const idea = DESIGN_IDEAS.find((i) => i.variants.length < THEME_REGISTRY.length);
      if (!idea) return;
      const missing = THEME_REGISTRY.find(
        (t) => !idea.variants.some((v) => v.language === t.id),
      )!;
      expect(getVariant(idea, missing.id)).toBeUndefined();
    });
  });
});
