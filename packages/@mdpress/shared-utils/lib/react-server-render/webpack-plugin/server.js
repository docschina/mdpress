"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactSSRServerPlugin = void 0;
const util_1 = require("./util");
class ReactSSRServerPlugin {
    constructor(options = {}) {
        this.options = Object.assign({
            filename: 'react-ssr-server-bundle.json',
        }, options);
    }
    apply(compiler) {
        util_1.validate(compiler);
        util_1.onEmit(compiler, 'react-server-plugin', (compilation, cb) => {
            const stats = compilation.getStats().toJson();
            const entryName = Object.keys(stats.entrypoints)[0];
            const entryInfo = stats.entrypoints[entryName];
            if (!entryInfo) {
                // #5553
                return cb();
            }
            const entryAssets = entryInfo.assets.filter(util_1.isJS);
            if (entryAssets.length > 1) {
                throw new Error('Server-side bundle should have one single entry file. ' +
                    'Avoid using CommonsChunkPlugin in the server config.');
            }
            const entry = entryAssets[0];
            if (!entry || typeof entry !== 'string') {
                throw new Error(`Entry "${entryName}" not found. Did you specify the correct entry option?`);
            }
            const bundle = {
                entry,
                files: {},
                maps: {},
            };
            stats.assets.forEach(asset => {
                if (asset.name.match(/\.js$/)) {
                    bundle.files[asset.name] = compilation.assets[asset.name].source();
                }
                else if (asset.name.match(/\.js\.map$/)) {
                    bundle.maps[asset.name.replace(/\.map$/, '')] = JSON.parse(compilation.assets[asset.name].source());
                }
                // do not emit anything else for server
                delete compilation.assets[asset.name];
            });
            const json = JSON.stringify(bundle, null, 2);
            const filename = this.options.filename;
            if (filename) {
                compilation.assets[filename] = {
                    source: () => json,
                    size: () => json.length,
                };
            }
            cb();
        });
    }
}
exports.ReactSSRServerPlugin = ReactSSRServerPlugin;
