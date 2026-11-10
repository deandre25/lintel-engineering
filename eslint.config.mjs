import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

/**
 * Flat config. `eslint-config-next/core-web-vitals` already brings the React,
 * React Hooks, jsx-a11y, import and typescript-eslint plugins, so this file
 * adds only the rules that enforce the brief's own constraints.
 */
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'next-env.d.ts',
    ],
  },

  ...nextCoreWebVitals,

  /* Type-aware rules need the program, which is only built for our own source. */
  {
    files: ['**/*.{ts,tsx,mts}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    rules: {
      /*
       * §2 and §17: the escape hatches are errors, not warnings. Without these
       * the brief's "zero `any`" target would depend on review rather than CI.
       */
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      /* §17: no `console.log` left in source. Diagnostics must be deliberate. */
      'no-console': ['error', { allow: ['warn', 'error'] }],

      /* §7: named exports throughout — except where a framework demands default. */
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use a union of string literals or an `as const` object instead of an enum.',
        },
      ],

      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-default-export': 'error',
    },
  },

  /*
   * Next's file conventions require default exports. Limiting the exception to
   * these filenames keeps the named-export rule meaningful everywhere else.
   */
  {
    files: [
      'src/app/**/{page,layout,route,template,default,error,loading,not-found,sitemap,robots,opengraph-image,twitter-image,icon,apple-icon,manifest}.{ts,tsx}',
      'src/i18n/request.ts',
      '*.config.{ts,mts,mjs,js}',
      'next.config.ts',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  /* Config and test files are not part of the shipped bundle. */
  {
    files: ['**/*.config.{ts,mts,mjs,js}', 'tests/**/*.ts', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'no-console': 'off',
    },
  },
);
