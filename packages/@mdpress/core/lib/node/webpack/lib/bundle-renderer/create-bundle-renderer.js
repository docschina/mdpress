'use strict';
/* eslint-disable*/
var __spreadArrays = (this && this.__spreadArrays) || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var fs_1 = __importDefault(require('fs'));
var path_1 = __importDefault(require('path'));
var stream_1 = require('stream');
var util_1 = require('../util');
var create_bundle_runner_1 = require('./create-bundle-runner');
var source_map_support_1 = require('./source-map-support');
var INVALID_MSG = 'Invalid server-rendering bundle format. Should be a string ' +
    'or a bundle Object of type:\n\n' +
    '{\n  entry: string;\n  files: { [filename: string]: string; };\n  maps: { [filename: string]: string; };\n}\n';
function createBundleRendererCreator(createRenderer) {
  return function createBundleRenderer(bundle, rendererOptions) {
    if (rendererOptions === void 0) { rendererOptions = {}; }
    var files;
    var entry;
    var maps;
    var basedir = rendererOptions.basedir;
    // load bundle if given filepath
    if (typeof bundle === 'string' &&
            /\.js(on)?$/.test(bundle) &&
            path_1.default.isAbsolute(bundle)) {
      if (fs_1.default.existsSync(bundle)) {
        var isJSON = /\.json$/.test(bundle);
        basedir = basedir || path_1.default.dirname(bundle);
        bundle = fs_1.default.readFileSync(bundle, 'utf-8');
        if (isJSON) {
          try {
            bundle = JSON.parse(bundle);
          }
          catch (e) {
            throw new Error('Invalid JSON bundle file: ' + bundle);
          }
        }
      }
      else {
        throw new Error('Cannot locate bundle file: ' + bundle);
      }
    }
    if (typeof bundle === 'object') {
      entry = bundle.entry;
      files = bundle.files;
      basedir = basedir || bundle.basedir;
      maps = source_map_support_1.createSourceMapConsumers(bundle.maps);
      if (typeof entry !== 'string' || typeof files !== 'object') {
        throw new Error(INVALID_MSG);
      }
    }
    else if (typeof bundle === 'string') {
      entry = '__react_ssr_bundle__';
      files = { __react_ssr_bundle__: bundle };
      maps = {};
    }
    else {
      throw new Error(INVALID_MSG);
    }
    var renderer = createRenderer(rendererOptions);
    var run = create_bundle_runner_1.createBundleRunner(entry, files, basedir, rendererOptions.runInNewContext);
    return {
      renderToString: function (context, cb) {
        var _a;
        if (typeof context === 'function') {
          cb = context;
          context = {};
        }
        var promise;
        if (!cb) {

          (_a = util_1.createPromiseCallback(), promise = _a.promise, cb = _a.cb);
        }
        run(context)
          .catch(function (err) {
            source_map_support_1.rewriteErrorTrace(err, maps);
            cb(err);
          })
          .then(function (app) {
            if (app) {
              renderer.renderToString(app, context, function (err, res) {
                source_map_support_1.rewriteErrorTrace(err, maps);
                cb(err, res);
              });
            }
          });
        return promise;
      },
      renderToStream: function (context) {
        if (context === void 0) { context = {}; }
        var res = new stream_1.PassThrough();
        run(context)
          .catch(function (err) {
            source_map_support_1.rewriteErrorTrace(err, maps);
            // avoid emitting synchronously before user can
            // attach error listener
            process.nextTick(function () {
              res.emit('error', err);
            });
          })
          .then(function (app) {
            if (app) {
              var renderStream = renderer.renderToStream(app, context);
              renderStream.on('error', function (err) {
                source_map_support_1.rewriteErrorTrace(err, maps);
                res.emit('error', err);
              });
              // relay HTMLStream special events
              if (rendererOptions && rendererOptions.template) {
                renderStream
                  .on('afterRender', function () { return res.emit('afterRender'); })
                  .on('beforeStart', function () { return res.emit('beforeStart'); })
                  .on('beforeEnd', function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                      args[_i] = arguments[_i];
                    }
                    return res.emit.apply(res, __spreadArrays(['beforeEnd'], args));
                  });
              }
              renderStream.pipe(res);
            }
          });
        return res;
      },
    };
  };
}
exports.createBundleRendererCreator = createBundleRendererCreator;
//# sourceMappingURL=create-bundle-renderer.js.map