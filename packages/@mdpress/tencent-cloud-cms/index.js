const { path } = require('@mdpress/shared-utils');

const Plugin = (options) => {
  return {
    name: 'mdpress-plugin-online',
    enhanceAppFiles: path.resolve(__dirname, 'client/index.js'),
    define: {
      TENCENT_CLOUD_ENV: options.tencentCloudEnv,
      CMS_DOCUMENT: options.tencentCloudModel ? options.tencentCloudModel.document : 'document',
      CMS_SIDEBAR: options.tencentCloudModel ? options.tencentCloudModel.sidebar : 'sidebar'
    }
  };
};
module.exports = Plugin;
