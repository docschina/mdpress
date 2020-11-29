// create package.json and README for packages that don't have one yet

const fs = require('fs');
const { path } = require('@mdpress/shared-utils');
const baseVersion = require('../packages/@mdpress/core/package.json').version;

const packagesDir = path.resolve(__dirname, '../packages/@mdpress');
const files = fs.readdirSync(packagesDir);

files.forEach(pkg => {
  if (pkg.charAt(0) === '.') return;

  const isPlugin = /^plugin-/.test(pkg);
  const desc = isPlugin
    ? `${pkg.replace('plugin-', '')} plugin for mdpress`
    : `${pkg} for mdpress`;

  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    const json = {
      'name': `@mdpress/${pkg}`,
      'version': baseVersion,
      'description': desc,
      'main': 'index.js',
      'publishConfig': {
        'access': 'public'
      },
      'repository': {
        'type': 'git',
        'url': 'git+https://github.com/docschina/mdpress.git'
      },
      'keywords': [
        'documentation',
        'markdown',
        'mdpress',
        'generator'
      ],
      'author': 'docschina',
      'license': 'MIT',
      'bugs': {
        'url': 'https://github.com/docschina/mdpress/issues'
      },
      'homepage': `https://github.com/docschina/mdpress/packages/@mdpress/${pkg}#readme`
    };
    fs.writeFileSync(pkgPath, JSON.stringify(json, null, 2));
  }

  const readmePath = path.join(packagesDir, pkg, 'README.md');
  if (!fs.existsSync(readmePath)) {
    fs.writeFileSync(readmePath, `# @mdpress/${pkg}\n\n> ${desc}`);
  }

  const npmIgnorePath = path.join(packagesDir, pkg, '.npmignore');
  if (!fs.existsSync(npmIgnorePath)) {
    fs.writeFileSync(npmIgnorePath, '__tests__\n__mocks__');
  }
});
