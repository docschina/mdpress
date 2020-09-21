const { path } = require('@mdpress/shared-utils');

module.exports = {
  enhanceAppFiles: [
    path.resolve(__dirname, 'enhanceAppFile.js')
  ],

  globalUIComponents: 'BackToTop'
};
