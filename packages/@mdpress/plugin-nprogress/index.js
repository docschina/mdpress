const { resolve } = require('path');

module.exports = {
  enhanceAppFiles: resolve(__dirname, 'enhanceAppFile.js'),
  alias: {
    '@loading': resolve(__dirname, 'Loading.js')
  }
};
