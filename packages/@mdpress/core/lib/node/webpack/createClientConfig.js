'use strict';

/**
 * Expose createClientConfig method.
 */

module.exports = function createClientConfig (ctx) {
  const { env } = require('@mdpress/shared-utils');
  const createBaseConfig = require('./createBaseConfig');
  const safeParser = require('postcss-safe-parser');

  const config = createBaseConfig(ctx);

  config
    .entry('app')
    .add(ctx.getLibFilePath('client/clientEntry.js'));

  config.node
    .merge({
      // prevent webpack from injecting useless setImmediate polyfill
      setImmediate: false,
      global: false,
      process: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    });

  // generate client manifest only during build
  if (process.env.NODE_ENV === 'production') {
    // TODO Switch back to original after problems are resolved.
    // Fixes two things:
    // 1. Include CSS in preload files
    // 2. filter out useless styles.xxxxx.js chunk from mini-css-extract-plugin
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
    const { ReactSSRClientPlugin } = require('./lib/webpack-plugin/client');

    config
      .plugin('ssr-client')
      .use(ReactSSRClientPlugin, [{
        filename: 'manifest/client.json'
      }]);

    config
      .plugin('optimize-css')
      .use(require('optimize-css-assets-webpack-plugin'), [{
        canPrint: false,
        cssProcessorOptions: {
          parser: safeParser,
          autoprefixer: { disable: true },
          mergeLonghand: false
        }
      }]);
  } else {
    config
      .plugin('hmr')
      .use(require('webpack/lib/HotModuleReplacementPlugin'));
  }

  if (!env.isDebug) {
    const WebpackBar = require('webpackbar');
    config
      .plugin('bar')
      .use(WebpackBar, [{
        name: 'Client',
        color: '#41b883',
        compiledIn: false
      }]);
  }

  ctx.pluginAPI.applySyncOption('chainWebpack', config, false /* isServer */);

  return config;
};
