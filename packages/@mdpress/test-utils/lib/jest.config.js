const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  verbose: true,
  testURL: 'http://localhost/',
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.(ts|js)?$',
  testPathIgnorePatterns: [
    'test.js',
    path.resolve(__dirname, '../test')
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.ts?$': '<rootDir>/node_modules/ts-jest',
    '^.+\\.styl': 'jest-transform-stub'
  },
  setupFiles: [
    path.resolve(__dirname, '../setup.js')
  ]
};
