const { path } = require('@mdpress/shared-utils');

module.exports = (options) => ({
  define: {
    SELECTOR: options.selector || '.theme-default-content :not(a) > img',
    OPTIONS: options.options
  },
  enhanceAppFiles: path.resolve(__dirname, 'enhanceAppFile.js')
});
