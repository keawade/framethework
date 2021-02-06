module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:node/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'eslint-comments/no-unused-disable': 'error',
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
    'node/no-missing-import': [
      'error',
      {
        tryExtensions: ['.js', '.ts', '.d.ts'],
      },
    ],
    'node/no-unpublished-import': [
      'error',
      {
        // Seems validator didn't do their module publishing properly?
        allowModules: ['validator'],
      },
    ],
    'node/shebang': ['off'],
  },
};
