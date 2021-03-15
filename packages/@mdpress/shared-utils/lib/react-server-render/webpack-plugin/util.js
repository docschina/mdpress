"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEmit = exports.validate = void 0;
const chalk_1 = __importDefault(require("chalk"));
const { red, yellow } = chalk_1.default;
const prefix = '[react-server-renderer-webpack-plugin]';
// tslint:disable-next-line:no-console
const warn = (exports.warn = msg => console.error(red(`${prefix} ${msg}\n`)));
// tslint:disable-next-line:no-console
const tip = (exports.tip = msg => console.log(yellow(`${prefix} ${msg}\n`)));
exports.validate = compiler => {
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
exports.onEmit = (compiler, name, hook) => {
    if (compiler.hooks) {
        // Webpack >= 4.0.0
        compiler.hooks.emit.tapAsync(name, hook);
    }
    else {
        // Webpack < 4.0.0
        compiler.plugin('emit', hook);
    }
};
var util_1 = require("../util");
Object.defineProperty(exports, "isJS", { enumerable: true, get: function () { return util_1.isJS; } });
Object.defineProperty(exports, "isCSS", { enumerable: true, get: function () { return util_1.isCSS; } });
