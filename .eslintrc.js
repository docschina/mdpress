module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,
    'jest': true
  },
  'extends': ['eslint:recommended', 'plugin:react/recommended'],
  'parserOptions': {
    'ecmaFeatures': {
      'experimentalObjectRestSpread': true,
      'jsx': true
    },
    'sourceType': 'module'
  },
  'plugins': [
    'react',
    'jest'
  ],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-console': 1,
    'block-spacing': [
      'error',
      'always'
    ],
    'no-trailing-spaces': [
      'error'
    ],
    'object-curly-spacing': ['error', 'always'],
    'semi-spacing': 'error',
    'space-infix-ops': 'error',
    'keyword-spacing': ['error', { 'before': true }],
    'key-spacing': ['error', { 'beforeColon': false, 'afterColon': true }],
    'react/prop-types': [1, { ignore: ['children'] }],
    'no-useless-escape': 'off',
    'no-empty': 'off',
    'no-prototype-builtins': 'off'
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        'no-useless-constructor': 'off',
        'no-useless-escape': 'off',
        'no-empty': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/camelcase': 'off'
      }
    },
    {
      files: [
        '**/__tests__/**/*.spec.js',
        '**/__tests__/**/*.spec.ts'
      ],
      extends: ['plugin:jest/recommended']
    }
  ],
  'parser': 'babel-eslint',
};