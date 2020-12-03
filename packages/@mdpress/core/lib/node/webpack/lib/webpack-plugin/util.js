'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var chalk_1 = __importDefault(require('chalk'));
var red = chalk_1.default.red, yellow = chalk_1.default.yellow;
var prefix = '[react-server-renderer-webpack-plugin]';
// tslint:disable-next-line:no-console
var warn = (exports.warn = function (msg) { return console.error(red(prefix + ' ' + msg + '\n')); });
// tslint:disable-next-line:no-console
var tip = (exports.tip = function (msg) { return console.log(yellow(prefix + ' ' + msg + '\n')); });
exports.validate = function (compiler) {
  if (compiler.options.target !== 'node') {
    warn('webpack config `target` should be "node".');
  }
  if (compiler.options.output &&
        compiler.options.output.libraryTarget !== 'commonjs2') {
    warn('webpack config `output.libraryTarget` should be "commonjs2".');
  }
  if (!compiler.options.externals) {
    tip('It is recommended to externalize dependencies in the server build for ' +
            'better build performance.');
  }
};
exports.onEmit = function (compiler, name, hook) {
  if (compiler.hooks) {
    // Webpack >= 4.0.0
    compiler.hooks.emit.tapAsync(name, hook);
  }
  else {
    // Webpack < 4.0.0
    compiler.plugin('emit', hook);
  }
};
var util_1 = require('../util');
exports.isJS = util_1.isJS;
exports.isCSS = util_1.isCSS;
//# sourceMappingURL=util.js.map