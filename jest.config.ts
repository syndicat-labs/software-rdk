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
  collectCoverageFrom: ['src/app/**/*.ts', '!src/app/**/*.spec.ts', '!src/main.ts'],
  coverageReporters: ['html', 'lcov', 'text-summary'],
  coverageThreshold: {
    'src/app/core/errors/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/core/auth/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/core/logging/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/core/http/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/forms/validators/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/pipes/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/directives/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/components/atoms/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    'src/app/shared/components/molecules/': { lines: 100, functions: 100, branches: 100, statements: 100 },
    global: { lines: 70, functions: 70, branches: 70, statements: 70 },
  },
};

export default config;
