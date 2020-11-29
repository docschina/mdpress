'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var path_1 = __importDefault(require('path'));
var vm_1 = __importDefault(require('vm'));
var module_1 = __importDefault(require('module'));
var lodash_1 = require('lodash');
var resolve_1 = __importDefault(require('resolve'));
function createSandbox(context) {
  var sandbox = {
    Buffer: Buffer,
    console: console,
    process: process,
    setTimeout: setTimeout,
    setInterval: setInterval,
    setImmediate: setImmediate,
    clearTimeout: clearTimeout,
    clearInterval: clearInterval,
    clearImmediate: clearImmediate,
    __REACT_SSR_CONTEXT__: context,
  };
  sandbox.global = sandbox;
  return sandbox;
}
function compileModule(files, basedir, runInNewContext) {
  var compiledScripts = {};
  var resolvedModules = {};
  function getCompiledScript(filename) {
    if (compiledScripts[filename]) {
      return compiledScripts[filename];
    }
    var code = files[filename];
    var wrapper = module_1.default.wrap(code);
    var script = new vm_1.default.Script(wrapper, {
      filename: filename,
      displayErrors: true,
    });
    compiledScripts[filename] = script;
    return script;
  }
  function evaluateModule(filename, sandbox, evaluatedFiles) {
    if (evaluatedFiles === void 0) { evaluatedFiles = {}; }
    if (evaluatedFiles[filename]) {
      return evaluatedFiles[filename];
    }
    var script = getCompiledScript(filename);
    var compiledWrapper = runInNewContext === false
      ? script.runInThisContext()
      : script.runInNewContext(sandbox);
    var m = { exports: {} };
    var r = function (file) {
      file = path_1.default.posix.join('.', file);
      if (files[file]) {
        return evaluateModule(file, sandbox, evaluatedFiles);
      }
      else if (basedir) {
        return require(resolvedModules[file] ||
                    (resolvedModules[file] = resolve_1.default.sync(file, { basedir: basedir })));
      }
      else {
        return require(file);
      }
    };
    compiledWrapper.call(m.exports, m.exports, r, m);
    var res = Object.prototype.hasOwnProperty.call(m.exports, 'default')
      ? m.exports.default
      : m.exports;
    evaluatedFiles[filename] = res;
    return res;
  }
  return evaluateModule;
}
function deepClone(val) {
  if (lodash_1.isPlainObject(val)) {
    var res = {};
    // tslint:disable-next-line forin
    for (var key in val) {
      res[key] = deepClone(val[key]);
    }
    return res;
  }
  else if (Array.isArray(val)) {
    return val.slice();
  }
  else {
    return val;
  }
}
function createBundleRunner(entry, files, basedir, runInNewContext) {
  var evaluate = compileModule(files, basedir, runInNewContext);
  if (runInNewContext !== false && runInNewContext !== 'once') {
    // new context mode: creates a fresh context and re-evaluate the bundle
    // on each render. Ensures entire application state is fresh for each
    // render, but incurs extra evaluation cost.
    return function (userContext) {
      if (userContext === void 0) { userContext = {}; }
      return new Promise(function (resolve) {
        userContext._registeredComponents = new Set();
        var res = evaluate(entry, createSandbox(userContext));
        resolve(typeof res === 'function' ? res(userContext) : res);
      });
    };
  }
  else {
    // direct mode: instead of re-evaluating the whole bundle on
    // each render, it simply calls the exported function. This avoids the
    // module evaluation costs but requires the source code to be structured
    // slightly differently.
    var runner_1; // lazy creation so that errors can be caught by user
    var initialContext_1;
    return function (userContext) {
      if (userContext === void 0) { userContext = {}; }
      return new Promise(function (resolve) {
        if (!runner_1) {
          var sandbox = runInNewContext === 'once' ? createSandbox() : global;
          // the initial context is only used for collecting possible non-component
          // styles injected by react-style-loader.
          initialContext_1 = sandbox.__REACT_SSR_CONTEXT__ = {};
          runner_1 = evaluate(entry, sandbox);
          // On subsequent renders, __REACT_SSR_CONTEXT__ will not be available
          // to prevent cross-request pollution.
          delete sandbox.__REACT_SSR_CONTEXT__;
          if (typeof runner_1 !== 'function') {
            throw new Error('bundle export should be a function when using ' +
                            '{ runInNewContext: false }.');
          }
        }
        userContext._registeredComponents = new Set();
        // react-style-loader styles imported outside of component lifecycle hooks
        if (initialContext_1._styles) {
          userContext._styles = deepClone(initialContext_1._styles);
          // #6353 ensure "styles" is exposed even if no styles are injected
          // in component lifecycles.
          // the renderStyles fn is exposed by react-style-loader >= 3.0.3
          var renderStyles_1 = initialContext_1._renderStyles;
          if (renderStyles_1) {
            Object.defineProperty(userContext, 'styles', {
              enumerable: true,
              get: function () {
                return renderStyles_1(userContext._styles);
              },
            });
          }
        }
        // debugger
        resolve(runner_1(userContext));
      });
    };
  }
}
exports.createBundleRunner = createBundleRunner;
//# sourceMappingURL=create-bundle-runner.js.map