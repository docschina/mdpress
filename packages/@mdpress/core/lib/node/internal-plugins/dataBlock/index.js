module.exports = () => ({
  name: '@mdpress/internal-data-block',

  chainWebpack (config) {
    config
      .module
      .rule('data-block')
      .resourceQuery(/blockType=data/)
      .use('date-block-loader')
      .loader(require.resolve('./loader.js'));
  },
});
