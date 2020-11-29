'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var lodash_1 = require('lodash');
var compileOptions = {
  escape: /{{([^{][\s\S]+?[^}])}}/g,
  interpolate: /{{{([\s\S]+?)}}}/g,
};
function parseTemplate(template, contentPlaceholder) {
  if (contentPlaceholder === void 0) { contentPlaceholder = '<div id="root"></div>'; }
  if (typeof template === 'object') {
    return template;
  }
  var i = template.indexOf('</head>');
  var j = template.indexOf(contentPlaceholder);
  if (j < 0) {
    throw new Error('Content placeholder not found in template.');
  }
  if (i < 0) {
    i = template.indexOf('<body>');
    if (i < 0) {
      i = j;
    }
  }
  return {
    head: lodash_1.template(template.slice(0, i), compileOptions),
    neck: lodash_1.template(template.slice(i, j), compileOptions),
    tail: lodash_1.template(template.slice(j + contentPlaceholder.length), compileOptions),
  };
}
exports.parseTemplate = parseTemplate;
//# sourceMappingURL=parse-template.js.map