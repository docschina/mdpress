'use strict';

/**
 * Expose createServerConfig method.
 */

module.exports = function createServerConfig (ctx) {
  const fs = require('fs');
  const { path, env,ReactSSRServerPlugin } = require('@mdpress/shared-utils');
  const createBaseConfig = require('./createBaseConfig');
  const CopyPlugin = require('copy-webpack-plugin');

  const config = createBaseConfig(ctx, true /* isServer */);
  const { sourceDir, outDir } = ctx;

  config
    .target('node')
    .externals([/^react|react-router-dom$/])
    .devtool('source-map');

  // no need to minimize server build
  config.optimization.minimize(false);

  config
    .entry('app')
    .add(ctx.getLibFilePath('client/serverEntry.js'));

  config.output
    .filename('server-bundle.js')
    .libraryTarget('commonjs2');

  config
    .plugin('ssr-server')
    .use(ReactSSRServerPlugin, [{
      filename: 'manifest/server.json'
    }]);

  const publicDir = path.resolve(sourceDir, '.mdpress/public');
  if (fs.existsSync(publicDir)) {
    config
      .plugin('copy')
      .use(CopyPlugin, [[
        { from: publicDir, to: outDir }
      ]]);
  }

  if (!env.isDebug) {
    const WebpackBar = require('webpackbar');
    config
      .plugin('bar')
      .use(WebpackBar, [{
        name: 'Server',
        color: 'blue',
        compiledIn: false
      }]);
  }

  ctx.pluginAPI.applySyncOption('chainWebpack', config, true /* isServer */);

  return config;
};
