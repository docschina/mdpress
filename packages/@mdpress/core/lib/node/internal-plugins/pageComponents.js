const { genImportComponentCode,commonImportCode } = require('./util');

module.exports = (options, ctx) => {
  const { pages } = ctx;
  // const componentNames = Object.keys(layoutComponentMap)

  return {
    name: '@mdpress/internal-page-components',

    async clientDynamicModules () {
      const importCode = commonImportCode;

      const code = `export default {\n${pages
        .filter(({ _filePath }) => _filePath)
        .map(({ key, _filePath }) => `  ${JSON.stringify(key)}: ${genImportComponentCode(_filePath,key)}`)
        .join(',\n')} \n}`;
      return { name: 'page-components.js', content: importCode + code, dirname: 'internal' };
    }
  };
};
