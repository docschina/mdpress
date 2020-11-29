const { fileToComponentName,genImportComponentCode,commonImportCode } = require('./util');
const { fs, path, globby, datatypes: { isString } } = require('@mdpress/shared-utils');

async function resolveComponents (componentDir) {
  if (!fs.existsSync(componentDir)) {
    return;
  }
  return await globby(['**/*.js'], { cwd: componentDir });
}

module.exports = (options) => ({
  name: '@mdpress/internal-sandbox',

  // @internal/routes
  async clientDynamicModules () {
    const { componentsDir = [] } = options;
    const baseDirs = Array.isArray(componentsDir) ? componentsDir : [componentsDir];

    let code = importCode();
    let sandbox = {};
    // 1. Register components in specified directories
    for (const baseDir of baseDirs) {
      if (!isString(baseDir)) {
        continue;
      }
      code += await genSandboxFile({ baseDir,sandbox }) + '\n';
    }

    // 2. all components
    code += `export default ${JSON.stringify(sandbox).replace(/"%([\w_-]*)%"/g, '$1')}`;

    return { name: 'sandbox.js', content: code, dirname: 'internal' };
  }
});

/**
 * Import utilities
 * @param {string} globalLayout path of global layout component
 * @returns {string}
 */
function importCode () {
  return commonImportCode;
}

const genSandboxFile = async function ({ baseDir,sandbox = {} }) {
  function genImport (file) {
    const name = fileToComponentName(file);
    const absolutePath = getAbsolutePath(file);
    let code = `export const ${name} = ${genImportComponentCode(absolutePath,name)}`;

    return code;
  }

  function getAbsolutePath(file) {
    return path.resolve(baseDir, file);
  }

  const components = (await resolveComponents(baseDir)) || [];

  components.forEach(file => {
    const name = fileToComponentName(file);
    sandbox[name.replace('_index','')] = `%${name}%`;
  });

  return [
    components.map(genImport).join('\n'),
  ].join('\n');
};
