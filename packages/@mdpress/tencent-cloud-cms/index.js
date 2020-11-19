const { path } = require('@mdpress/shared-utils');

const Plugin = (options) => {
  return {
    name: 'mdpress-plugin-online',
    enhanceAppFiles: path.resolve(__dirname, 'client/index.js'),
    define: {
      TENCENT_CLOUD_ENV: options.tencentCloudEnv,
      CMS_DOCUMENT: options.tencentCloudModel ? options.tencentCloudModel.document : 'document',
      CMS_SIDEBAR: options.tencentCloudModel ? options.tencentCloudModel.sidebar : 'sidebar'
    },
    chainWebpack(config) {
      const tencentJsSdkDir = path.dirname(require.resolve('@cloudbase/js-sdk/package.json'));
      const tencentJsSdk = path.resolve(tencentJsSdkDir,'node_modules');

      const modules = config.resolveLoader.modules.values();
      config.resolveLoader.modules.clear();
      config.resolve.modules.clear();

      modules.unshift(tencentJsSdk);

      config.resolveLoader.modules.merge(modules);
      config.resolve.modules.merge(modules);
    }
  };
};
module.exports = Plugin;
