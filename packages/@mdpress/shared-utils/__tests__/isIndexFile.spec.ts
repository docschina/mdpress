import { isIndexFile } from '../src/isIndexFile';

test('isIndexFile', () => {
  [
    'README.md',
    'readme.md',
    'INDEX.md',
    'index.md',
    'foo/README.md',
    'foo/index.md',
    'README.js',
    'readme.js',
    'INDEX.js',
    'index.js',
    'foo/README.js',
    'foo/index.js'
  ].forEach(file => {
    expect(isIndexFile(file)).toBe(true);
  });
  [
    'foo/one.md',
    'one.md',
    'one-index.md',
    'foo/one-index.md',
    'foo/one.js',
    'one.js',
    'one-index.js',
    'foo/one-index.js'
  ].forEach(file => {
    expect(isIndexFile(file)).toBe(false);
  });
});
