"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIndexFile = exports.indexRE = void 0;
exports.indexRE = /(^|.*\/)(index|readme)\.(md|js)$/i;
function isIndexFile(file) {
    return exports.indexRE.test(file);
}
exports.isIndexFile = isIndexFile;
