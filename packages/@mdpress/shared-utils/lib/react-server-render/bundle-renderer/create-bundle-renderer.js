"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBundleRendererCreator = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const util_1 = require("../util");
const create_bundle_runner_1 = require("./create-bundle-runner");
const source_map_support_1 = require("./source-map-support");
const INVALID_MSG = 'Invalid server-rendering bundle format. Should be a string ' +
    'or a bundle Object of type:\n\n' +
    `{
  entry: string;
  files: { [filename: string]: string; };
  maps: { [filename: string]: string; };
}\n`;
function createBundleRendererCreator(createRenderer) {
    return function createBundleRenderer(bundle, rendererOptions = {}) {
        let files;
        let entry;
        let maps;
        let { basedir } = rendererOptions;
        // load bundle if given filepath
        if (typeof bundle === 'string' &&
            /\.js(on)?$/.test(bundle) &&
            path_1.default.isAbsolute(bundle)) {
            if (fs_1.default.existsSync(bundle)) {
                const isJSON = /\.json$/.test(bundle);
                basedir = basedir || path_1.default.dirname(bundle);
                bundle = fs_1.default.readFileSync(bundle, 'utf-8');
                if (isJSON) {
                    try {
                        bundle = JSON.parse(bundle);
                    }
                    catch (e) {
                        throw new Error(`Invalid JSON bundle file: ${bundle}`);
                    }
                }
            }
            else {
                throw new Error(`Cannot locate bundle file: ${bundle}`);
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
        const renderer = createRenderer(rendererOptions);
        const run = create_bundle_runner_1.createBundleRunner(entry, files, basedir, rendererOptions.runInNewContext);
        return {
            renderToString: (context, cb) => {
                if (typeof context === 'function') {
                    cb = context;
                    context = {};
                }
                let promise;
                if (!cb) {
                    ({ promise, cb } = util_1.createPromiseCallback());
                }
                run(context)
                    .catch(err => {
                    source_map_support_1.rewriteErrorTrace(err, maps);
                    cb(err);
                })
                    .then((app) => {
                    if (app && renderer.renderToString) {
                        renderer.renderToString(app, context || {}, (err, res) => {
                            source_map_support_1.rewriteErrorTrace(err, maps);
                            cb(err, res);
                        });
                    }
                });
                return promise;
            },
            renderToStream: (context = {}) => {
                const res = new stream_1.PassThrough();
                run(context)
                    .catch(err => {
                    source_map_support_1.rewriteErrorTrace(err, maps);
                    // avoid emitting synchronously before user can
                    // attach error listener
                    process.nextTick(() => {
                        res.emit('error', err);
                    });
                })
                    .then((app) => {
                    if (app) {
                        const renderStream = renderer.renderToStream(app, context);
                        renderStream.on('error', err => {
                            source_map_support_1.rewriteErrorTrace(err, maps);
                            res.emit('error', err);
                        });
                        // relay HTMLStream special events
                        if (rendererOptions && rendererOptions.template) {
                            renderStream
                                .on('afterRender', () => res.emit('afterRender'))
                                .on('beforeStart', () => res.emit('beforeStart'))
                                .on('beforeEnd', (...args) => res.emit('beforeEnd', ...args));
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
