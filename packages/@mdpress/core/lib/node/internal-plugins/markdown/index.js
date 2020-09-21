const snippet = require('./snippet');
module.exports = (options,ctx) => ({
  name: '@mdpress/internal-markdown',

  chainMarkdown (config) {
    const { tempPath } = ctx;
    config.plugin('snippet')
      .use(snippet)
      .tap(([options]) => [
        Object.assign({},options, { tempPath })
      ])
      .end();
  },

  async clientDynamicModules () {
    return { name: 'snippetMap.js', content: '', dirname: 'internal' };
  }
});
