"use strict";
const isIndexFile_1 = require("./isIndexFile");
const extRE = /\.(js|md)$/;
module.exports = function fileToPath(file) {
    if (isIndexFile_1.isIndexFile(file)) {
        // README.md -> /
        // README.js -> /
        // foo/README.md -> /foo/
        // foo/README.js -> /foo/
        return file.replace(isIndexFile_1.indexRE, '/$1');
    }
    else {
        // foo.md -> /foo.html
        // foo.js -> /foo.html
        // foo/bar.md -> /foo/bar.html
        // foo/bar.js -> /foo/bar.html
        return `/${file.replace(extRE, '').replace(/\\/g, '/')}.html`;
    }
};
