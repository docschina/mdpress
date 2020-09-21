const { genImportComponentCode,commonImportCode } = require('./util');

module.exports = (options, ctx) => {
  return {
    name: '@mdpress/internal-layout-components',

    async clientDynamicModules () {
      const componentNames = Object.keys(ctx.themeAPI.layoutComponentMap);
      const importCode = commonImportCode;

      const code = `export default {\n${componentNames
        .map(name => `  ${JSON.stringify(name)}: ${genImportComponentCode(ctx.themeAPI.layoutComponentMap[name].path,name)}`)
        .join(',\n')} \n}`;
      return { name: 'layout-components.js', content: importCode + code, dirname: 'internal' };
    }
  };
};
