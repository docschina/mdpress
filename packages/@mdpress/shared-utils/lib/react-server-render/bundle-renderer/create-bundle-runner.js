"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBundleRunner = void 0;
const path_1 = __importDefault(require("path"));
const vm_1 = __importDefault(require("vm"));
const module_1 = __importDefault(require("module"));
const lodash_1 = require("lodash");
const resolve_1 = __importDefault(require("resolve"));
function createSandbox(context) {
    const sandbox = {
        Buffer,
        console,
        process,
        setTimeout,
        setInterval,
        setImmediate,
        clearTimeout,
        clearInterval,
        clearImmediate,
        __REACT_SSR_CONTEXT__: context,
    };
    sandbox.global = sandbox;
    return sandbox;
}
function compileModule(files, basedir, runInNewContext) {
    const compiledScripts = {};
    const resolvedModules = {};
    function getCompiledScript(filename) {
        if (compiledScripts[filename]) {
            return compiledScripts[filename];
        }
        const code = files[filename];
        const wrapper = module_1.default.wrap(code);
        const script = new vm_1.default.Script(wrapper, {
            filename,
            displayErrors: true,
        });
        compiledScripts[filename] = script;
        return script;
    }
    function evaluateModule(filename, sandbox, evaluatedFiles = {}) {
        if (evaluatedFiles[filename]) {
            return evaluatedFiles[filename];
        }
        const script = getCompiledScript(filename);
        const compiledWrapper = runInNewContext === false
            ? script.runInThisContext()
            : script.runInNewContext(sandbox);
        const m = { exports: {} };
        const r = file => {
            file = path_1.default.posix.join('.', file);
            if (files[file]) {
                return evaluateModule(file, sandbox, evaluatedFiles);
            }
            else if (basedir) {
                return require(resolvedModules[file] ||
                    (resolvedModules[file] = resolve_1.default.sync(file, { basedir })));
            }
            else {
                return require(file);
            }
        };
        compiledWrapper.call(m.exports, m.exports, r, m);
        const res = Object.prototype.hasOwnProperty.call(m.exports, 'default')
            ? m.exports.default
            : m.exports;
        evaluatedFiles[filename] = res;
        return res;
    }
    return evaluateModule;
}
function deepClone(val) {
    if (lodash_1.isPlainObject(val)) {
        const res = {};
        // tslint:disable-next-line forin
        for (const key in val) {
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
    const evaluate = compileModule(files, basedir, runInNewContext);
    if (runInNewContext !== false && runInNewContext !== 'once') {
        // new context mode: creates a fresh context and re-evaluate the bundle
        // on each render. Ensures entire application state is fresh for each
        // render, but incurs extra evaluation cost.
        return (userContext = {}) => new Promise(resolve => {
            userContext._registeredComponents = new Set();
            const res = evaluate(entry, createSandbox(userContext));
            resolve(typeof res === 'function' ? res(userContext) : res);
        });
    }
    else {
        // direct mode: instead of re-evaluating the whole bundle on
        // each render, it simply calls the exported function. This avoids the
        // module evaluation costs but requires the source code to be structured
        // slightly differently.
        let runner; // lazy creation so that errors can be caught by user
        let initialContext;
        return (userContext = {}) => new Promise(resolve => {
            if (!runner) {
                const sandbox = runInNewContext === 'once' ? createSandbox() : global;
                // the initial context is only used for collecting possible non-component
                // styles injected by react-style-loader.
                initialContext = sandbox.__REACT_SSR_CONTEXT__ = {};
                runner = evaluate(entry, sandbox);
                // On subsequent renders, __REACT_SSR_CONTEXT__ will not be available
                // to prevent cross-request pollution.
                delete sandbox.__REACT_SSR_CONTEXT__;
                if (typeof runner !== 'function') {
                    throw new Error('bundle export should be a function when using ' +
                        '{ runInNewContext: false }.');
                }
            }
            userContext._registeredComponents = new Set();
            // react-style-loader styles imported outside of component lifecycle hooks
            if (initialContext._styles) {
                userContext._styles = deepClone(initialContext._styles);
                // #6353 ensure "styles" is exposed even if no styles are injected
                // in component lifecycles.
                // the renderStyles fn is exposed by react-style-loader >= 3.0.3
                const renderStyles = initialContext._renderStyles;
                if (renderStyles) {
                    Object.defineProperty(userContext, 'styles', {
                        enumerable: true,
                        get() {
                            return renderStyles(userContext._styles);
                        },
                    });
                }
            }
            resolve(runner(userContext));
        });
    }
}
exports.createBundleRunner = createBundleRunner;
