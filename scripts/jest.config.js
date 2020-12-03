const path = require('upath');
const { createJestConfig } = require('@mdpress/test-utils');

module.exports = createJestConfig({
  rootDir: path.resolve(__dirname, '..'),
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@core/(.*)$': '<rootDir>/packages/@mdpress/core/$1',
    '^@app/(.*)$': '<rootDir>/packages/@mdpress/core/lib/client/$1',
    '^@theme/(.*)$': '<rootDir>/packages/@mdpress/theme-default/$1',
    '^@temp/(.*)$': '<rootDir>/.temp/$1',
    '^@internal/(.*)$': '<rootDir>/.temp/internal/$1',
    '^@transform/(.*)$': '<rootDir>/.temp/transform/$1'
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/@mdpress/core/__test__/plugin-api/AsyncOption.spec.js'
  ]
});
