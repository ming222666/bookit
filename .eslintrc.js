module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    // 'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    '@next/next/no-img-element': 'off',
    '@next/next/no-sync-scripts': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
        '@typescript-eslint/no-unused-vars': ['error'],
        'no-console': ['error'],
        '@next/next/no-img-element': ['warn'],
        '@next/next/no-sync-scripts': ['warn'],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
