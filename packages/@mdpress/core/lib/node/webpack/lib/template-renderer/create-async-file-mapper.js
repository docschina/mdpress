'use strict';
/**
 * Creates a mapper that maps components used during a server-side render
 * to async chunk files in the client-side build, so that we can inline them
 * directly in the rendered HTML to avoid waterfall requests.
 */
Object.defineProperty(exports, '__esModule', { value: true });
function createMapper(clientManifest) {
  var map = createMap(clientManifest);
  // map server-side moduleIds to client-side files
  return function mapper(moduleIds) {
    var res = new Set();
    for (var _i = 0, moduleIds_1 = moduleIds; _i < moduleIds_1.length; _i++) {
      var moduleId = moduleIds_1[_i];
      var mapped = map.get(moduleId);
      if (mapped) {
        for (var _a = 0, mapped_1 = mapped; _a < mapped_1.length; _a++) {
          var item = mapped_1[_a];
          res.add(item);
        }
      }
    }
    return Array.from(res);
  };
}
exports.createMapper = createMapper;
function createMap(clientManifest) {
  var map = new Map();
  Object.keys(clientManifest.modules).forEach(function (id) {
    map.set(id, mapIdToFile(id, clientManifest));
  });
  return map;
}
function mapIdToFile(id, clientManifest) {
  var files = [];
  var fileIndices = clientManifest.modules[id];
  if (fileIndices) {
    fileIndices.forEach(function (index) {
      var file = clientManifest.all[index];
      // only include async files or non-js assets
      if (clientManifest.async.indexOf(file) > -1 || !/\.js($|\?)/.test(file)) {
        files.push(file);
      }
    });
  }
  return files;
}
//# sourceMappingURL=create-async-file-mapper.js.map