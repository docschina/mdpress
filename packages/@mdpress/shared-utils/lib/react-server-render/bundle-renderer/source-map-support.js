"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteErrorTrace = exports.createSourceMapConsumers = void 0;
const source_map_1 = require("source-map");
const filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/;
function createSourceMapConsumers(rawMaps) {
    const maps = {};
    Object.keys(rawMaps).forEach(file => {
        maps[file] = new source_map_1.SourceMapConsumer(rawMaps[file]);
    });
    return maps;
}
exports.createSourceMapConsumers = createSourceMapConsumers;
function rewriteTraceLine(trace, mapConsumers) {
    const m = trace.match(filenameRE);
    const map = m && mapConsumers[m[1]];
    if (m != null && map) {
        const originalPosition = map.originalPositionFor({
            line: Number(m[2]),
            column: Number(m[3]),
        });
        if (originalPosition.source != null) {
            const { source, line, column } = originalPosition;
            const mappedPosition = `(${source.replace(/^webpack:\/\/\//, '')}:${String(line)}:${String(column)})`;
            return trace.replace(filenameRE, mappedPosition);
        }
        else {
            return trace;
        }
    }
    else {
        return trace;
    }
}
function rewriteErrorTrace(e, mapConsumers) {
    if (e && typeof e.stack === 'string') {
        e.stack = e.stack
            .split('\n')
            .map(line => {
            return rewriteTraceLine(line, mapConsumers);
        })
            .join('\n');
    }
}
exports.rewriteErrorTrace = rewriteErrorTrace;
