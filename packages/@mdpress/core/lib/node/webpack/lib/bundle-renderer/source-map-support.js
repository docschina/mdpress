'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var source_map_1 = require('source-map');
var filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/;
function createSourceMapConsumers(rawMaps) {
  var maps = {};
  Object.keys(rawMaps).forEach(async function (file) {
    maps[file] = await new source_map_1.SourceMapConsumer(rawMaps[file]);
  });
  return maps;
}
exports.createSourceMapConsumers = createSourceMapConsumers;
function rewriteErrorTrace(e, mapConsumers) {
  if (e && typeof e.stack === 'string') {
    e.stack = e.stack
      .split('\n')
      .map(function (line) {
        return rewriteTraceLine(line, mapConsumers);
      })
      .join('\n');
  }
}
exports.rewriteErrorTrace = rewriteErrorTrace;
function rewriteTraceLine(trace, mapConsumers) {
  var m = trace.match(filenameRE);
  var map = m && mapConsumers[m[1]];
  if (m != null && map) {
    var originalPosition = map.originalPositionFor({
      line: Number(m[2]),
      column: Number(m[3]),
    });
    if (originalPosition.source != null) {
      var source = originalPosition.source, line = originalPosition.line, column = originalPosition.column;
      var mappedPosition = '(' + source.replace(/^webpack:\/\/\//, '') + ':' + String(line) + ':' + String(column) + ')';
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
//# sourceMappingURL=source-map-support.js.map