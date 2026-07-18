// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('@angular-eslint/eslint-plugin');
const angularTemplate = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      '@angular-eslint': angular,
    },
    rules: {
      // Angular-specific
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      'no-console': 'error',
    },
  },
  {
    // Sanctioned console sinks: the app-bootstrap last-resort handler (no DI yet)
    // and the logging/theme services that ARE the console boundary.
    files: ['src/main.ts', 'src/app/core/logging/**/*.ts', 'src/app/core/theme/theme.service.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
    },
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/use-track-by-function': 'warn',
      '@angular-eslint/template/no-call-expression': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  prettierConfig,
  {
    ignores: ['dist/', 'node_modules/', '.angular/', 'coverage/', '*.js', '*.mjs'],
  },
);
