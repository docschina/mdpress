'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var util_1 = require('./util');
var ReactSSRServerPlugin = /** @class */ (function () {
  function ReactSSRServerPlugin(options) {
    if (options === void 0) { options = {}; }
    this.options = Object.assign({
      filename: 'react-ssr-server-bundle.json',
    }, options);
  }
  ReactSSRServerPlugin.prototype.apply = function (compiler) {
    var _this = this;
    util_1.validate(compiler);
    util_1.onEmit(compiler, 'react-server-plugin', function (compilation, cb) {
      var stats = compilation.getStats().toJson();
      var entryName = Object.keys(stats.entrypoints)[0];
      var entryInfo = stats.entrypoints[entryName];
      if (!entryInfo) {
        // #5553
        return cb();
      }
      var entryAssets = entryInfo.assets.filter(util_1.isJS);
      if (entryAssets.length > 1) {
        throw new Error('Server-side bundle should have one single entry file. ' +
                    'Avoid using CommonsChunkPlugin in the server config.');
      }
      var entry = entryAssets[0];
      if (!entry || typeof entry !== 'string') {
        throw new Error('Entry "' + entryName + '" not found. Did you specify the correct entry option?');
      }
      var bundle = {
        entry: entry,
        files: {},
        maps: {},
      };
      stats.assets.forEach(function (asset) {
        if (asset.name.match(/\.js$/)) {
          bundle.files[asset.name] = compilation.assets[asset.name].source();
        }
        else if (asset.name.match(/\.js\.map$/)) {
          bundle.maps[asset.name.replace(/\.map$/, '')] = JSON.parse(compilation.assets[asset.name].source());
        }
        // do not emit anything else for server
        delete compilation.assets[asset.name];
      });
      var json = JSON.stringify(bundle, null, 2);
      var filename = _this.options.filename;
      compilation.assets[filename] = {
        source: function () { return json; },
        size: function () { return json.length; },
      };
      cb();
    });
  };
  return ReactSSRServerPlugin;
}());
exports.ReactSSRServerPlugin = ReactSSRServerPlugin;
//# sourceMappingURL=server.js.map