"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactSSRClientPlugin = void 0;
const util_1 = require("./util");
const hash_sum_1 = __importDefault(require("hash-sum"));
const lodash_1 = require("lodash");
const styleJsChunkreg = /styles\.\w{8}\.js$/;
class ReactSSRClientPlugin {
    constructor(options = {}) {
        this.options = Object.assign({
            filename: 'react-ssr-client-manifest.json',
        }, options);
    }
    apply(compiler) {
        util_1.onEmit(compiler, 'react-client-plugin', (compilation, cb) => {
            const stats = compilation.getStats().toJson();
            const allFiles = lodash_1.uniq(stats.assets
                .map(a => a.name)
                // Avoid preloading / injecting the style chunk
                .filter(file => !styleJsChunkreg.test(file)));
            const initialFiles = lodash_1.uniq(Object.keys(stats.entrypoints)
                .map(name => stats.entrypoints[name].assets)
                .reduce((assets, all) => all.concat(assets), [])
                .filter(file => util_1.isJS(file) || util_1.isCSS(file))
                .filter(function (file) { return !styleJsChunkreg.test(file); }));
            const asyncFiles = allFiles
                .filter(file => util_1.isJS(file) || util_1.isCSS(file))
                .filter(file => initialFiles.indexOf(file) < 0);
            const manifest = {
                publicPath: stats.publicPath,
                all: allFiles,
                initial: initialFiles,
                async: asyncFiles,
                modules: {
                /* [identifier: string]: Array<index: number> */
                },
            };
            const assetModules = stats.modules.filter(m => m.assets.length);
            const fileToIndex = file => manifest.all.indexOf(file);
            stats.modules.forEach(m => {
                // ignore modules duplicated in multiple chunks
                if (m.chunks.length === 1) {
                    const cid = m.chunks[0];
                    const chunk = stats.chunks.find(c => c.id === cid);
                    if (!chunk || !chunk.files) {
                        return;
                    }
                    const id = m.identifier.replace(/\s\w+$/, ''); // remove appended hash
                    const files = (manifest.modules[hash_sum_1.default(id)] = chunk.files.map(fileToIndex));
                    // find all asset modules associated with the same chunk
                    assetModules.forEach(module => {
                        if (module.chunks.some(chunkId => chunkId === cid)) {
                            files.push(...module.assets.map(fileToIndex));
                        }
                    });
                }
            });
            // const debug = (file, obj) => {
            //   require('fs').writeFileSync(__dirname + '/' + file, JSON.stringify(obj, null, 2))
            // }
            // debug('stats.json', stats)
            // debug('client-manifest.json', manifest)
            const json = JSON.stringify(manifest, null, 2);
            if (this.options && this.options.filename) {
                compilation.assets[this.options.filename] = {
                    source: () => json,
                    size: () => json.length,
                };
            }
            cb();
        });
    }
}
exports.ReactSSRClientPlugin = ReactSSRClientPlugin;
