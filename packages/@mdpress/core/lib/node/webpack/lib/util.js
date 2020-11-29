'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isJS = function (file) { return /\.js(\?[^.]+)?$/.test(file); };
exports.isCSS = function (file) { return /\.css(\?[^.]+)?$/.test(file); };
function createPromiseCallback() {
  var resolve;
  var reject;
  // tslint:disable-next-line variable-name
  var promise = new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  });
  var cb = function (err, res) {
    if (err) {
      return reject(err);
    }
    resolve(res || '');
  };
  return { promise: promise, cb: cb };
}
exports.createPromiseCallback = createPromiseCallback;
//# sourceMappingURL=util.js.map