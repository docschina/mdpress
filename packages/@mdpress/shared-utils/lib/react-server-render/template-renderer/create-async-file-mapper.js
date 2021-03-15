"use strict";
/**
 * Creates a mapper that maps components used during a server-side render
 * to async chunk files in the client-side build, so that we can inline them
 * directly in the rendered HTML to avoid waterfall requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMapper = void 0;
function mapIdToFile(id, clientManifest) {
    const files = [];
    const fileIndices = clientManifest.modules[id];
    if (fileIndices) {
        fileIndices.forEach(index => {
            const file = clientManifest.all[index];
            // only include async files or non-js assets
            if (clientManifest.async.indexOf(file) > -1 || !/\.js($|\?)/.test(file)) {
                files.push(file);
            }
        });
    }
    return files;
}
function createMap(clientManifest) {
    const map = new Map();
    Object.keys(clientManifest.modules).forEach(id => {
        map.set(id, mapIdToFile(id, clientManifest));
    });
    return map;
}
function createMapper(clientManifest) {
    const map = createMap(clientManifest);
    // map server-side moduleIds to client-side files
    return function mapper(moduleIds) {
        const res = new Set();
        for (const moduleId of moduleIds) {
            const mapped = map.get(moduleId);
            if (mapped) {
                for (const item of mapped) {
                    res.add(item);
                }
            }
        }
        return Array.from(res);
    };
}
exports.createMapper = createMapper;
