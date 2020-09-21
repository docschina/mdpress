'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var util_1 = require('./util');
var hash_sum_1 = __importDefault(require('hash-sum'));
var lodash_1 = require('lodash');
var ReactSSRClientPlugin = /** @class */ (function () {
  function ReactSSRClientPlugin(options) {
    if (options === void 0) { options = {}; }
    this.options = Object.assign({
      filename: 'react-ssr-client-manifest.json',
    }, options);
  }
  ReactSSRClientPlugin.prototype.apply = function (compiler) {
    var _this = this;
    util_1.onEmit(compiler, 'react-client-plugin', function (compilation, cb) {
      var stats = compilation.getStats().toJson();
      var allFiles = lodash_1.uniq(stats.assets.map(function (a) { return a.name; }));
      var initialFiles = lodash_1.uniq(Object.keys(stats.entrypoints)
        .map(function (name) { return stats.entrypoints[name].assets; })
        .reduce(function (assets, all) { return all.concat(assets); }, [])
        .filter(function (file) { return util_1.isJS(file) || util_1.isCSS(file); }));
      var asyncFiles = allFiles
        .filter(function (file) { return util_1.isJS(file) || util_1.isCSS(file); })
        .filter(function (file) { return initialFiles.indexOf(file) < 0; });
      var manifest = {
        publicPath: stats.publicPath,
        all: allFiles,
        initial: initialFiles,
        async: asyncFiles,
        modules: {
          /* [identifier: string]: Array<index: number> */
        },
      };
      var assetModules = stats.modules.filter(function (m) { return m.assets.length; });
      var fileToIndex = function (file) { return manifest.all.indexOf(file); };
      stats.modules.forEach(function (m) {
        // ignore modules duplicated in multiple chunks
        if (m.chunks.length === 1) {
          var cid_1 = m.chunks[0];
          var chunk = stats.chunks.find(function (c) { return c.id === cid_1; });
          if (!chunk || !chunk.files) {
            return;
          }
          var id = m.identifier.replace(/\s\w+$/, ''); // remove appended hash
          var files_1 = (manifest.modules[hash_sum_1.default(id)] = chunk.files.map(fileToIndex));
          // find all asset modules associated with the same chunk
          assetModules.forEach(function (module) {
            if (module.chunks.some(function (chunkId) { return chunkId === cid_1; })) {
              files_1.push.apply(files_1, module.assets.map(fileToIndex));
            }
          });
        }
      });
      // const debug = (file, obj) => {
      //   require('fs').writeFileSync(__dirname + '/' + file, JSON.stringify(obj, null, 2))
      // }
      // debug('stats.json', stats)
      // debug('client-manifest.json', manifest)
      var json = JSON.stringify(manifest, null, 2);
      compilation.assets[_this.options.filename] = {
        source: function () { return json; },
        size: function () { return json.length; },
      };
      cb();
    });
  };
  return ReactSSRClientPlugin;
}());
exports.ReactSSRClientPlugin = ReactSSRClientPlugin;
//# sourceMappingURL=client.js.map