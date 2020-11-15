'use strict';

/**
 * Module dependencies.
 */

const { normalizeHeadTag } = require('../util/index');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Expose HeadPlugin class.
 */

module.exports = class HeadPlugin {
  constructor ({ tags }) {
    this.tags = tags;
  }

  apply (compiler) {
    compiler.hooks.compilation.tap('mdpress-site-data', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('mdpress-site-data', (data, cb) => {
        try {
          this.tags.forEach(tag => {
            data.headTags.push(normalizeHeadTag(tag));
          });
        } catch (e) {
          return cb(e);
        }
        cb(null, data);
      });
    });
  }
};
