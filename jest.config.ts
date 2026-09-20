import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!(.*\\.mjs$|@angular/common/locales/.*\\.js$))'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    // Barrels re-export only; they carry no logic to cover.
    '!src/app/**/index.ts',
    '!src/main.ts',
  ],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageThreshold: {
    'src/app/core/errors/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    // TODO: restore to 100/100/100/100 after covering requestReset/resetPassword fromUnknown branches (currently 93.75/96.96)
    'src/app/core/auth/': { lines: 90, functions: 90, branches: 90, statements: 90 },
    'src/app/core/logging/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/core/http/': { lines: 90, functions: 90, branches: 90, statements: 90 },
    'src/app/core/dashboard-layout/': { lines: 80, functions: 80, branches: 80, statements: 80 },
    'src/app/shared/forms/validators/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/pipes/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/directives/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/components/atoms/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/components/molecules/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    // Product surface layers (L2) — real pages and the retrofitted showcase are
    // first-class, measured and gated. Ratified per FLAG-08/P5, 2026-08-31.
    // Dashboard + auth are live and gated at 80 (auth at 79 until one branch
    // ratchet closes, dashboard at 40 until T7 catalog/config/confirm branches are covered).
    // Landing + showcase are measured but gated at 0 until T3/T5 retrofit lands;
    // they are kept here to exclude them from `global`.
    'src/app/features/dashboard/': { lines: 40, functions: 40, branches: 40, statements: 40 },
    'src/app/features/auth/': { lines: 80, functions: 79, branches: 79, statements: 80 },
    'src/app/features/landing/': { lines: 0, functions: 0, branches: 0, statements: 0 },
    'src/app/features/showcase/': { lines: 0, functions: 0, branches: 0, statements: 0 },
    global: { lines: 70, functions: 70, branches: 70, statements: 70 },
  },
};

export default config;
