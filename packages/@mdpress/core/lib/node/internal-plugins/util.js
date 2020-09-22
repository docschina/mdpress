const indexRE = /(^|.*\/)(index|readme)\.md$/i;
const extRE = /\.(js|md)$/;
exports.fileToComponentName = function (file) {
  let normalizedName = file
    .replace(/\/|\\|-/g, '_')
    .replace(extRE, '');
  if (exports.isIndexFile(file)) {
    normalizedName = normalizedName.replace(/readme$/i, 'index');
  }
  const pagePrefix = /\.md$/.test(file) ? 'page_' : '';
  return `${pagePrefix}${normalizedName}`;
};

exports.isIndexFile = function (file) {
  return indexRE.test(file);
};

exports.sort = function (arr) {
  return arr.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
};

exports.genImportComponentCode = function (filename,key) {
  return `LazyLoadComponent(() => import(${JSON.stringify(filename)}),"${key}")`;
};

exports.commonImportCode = 'import { LazyLoadComponent } from \'@app/LazyLoader\';\n' +
    'import { getEnv } from \'@app/util\';\n' +
    'const isServer = getEnv() === "server";\n';