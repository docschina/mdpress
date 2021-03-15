"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPromiseCallback = exports.isCSS = exports.isJS = void 0;
exports.isJS = (file) => /\.js(\?[^.]+)?$/.test(file);
exports.isCSS = (file) => /\.css(\?[^.]+)?$/.test(file);
function createPromiseCallback() {
    let resolve;
    let reject;
    // tslint:disable-next-line variable-name
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    const cb = (err, res) => {
        if (err) {
            return reject(err);
        }
        resolve(res || '');
    };
    return { promise, cb };
}
exports.createPromiseCallback = createPromiseCallback;
