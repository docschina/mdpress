const fs = require('fs');
const path = require('path');

const Packages = fs.readdirSync(path.resolve(__dirname, 'packages/@mdpress'));

module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'cli',
        'zh',
        ...Packages
      ].map(name => `$${name}`)
    ]
  }
};
