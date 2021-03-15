"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTemplate = void 0;
const lodash_1 = require("lodash");
const compileOptions = {
    escape: /{{([^{][\s\S]+?[^}])}}/g,
    interpolate: /{{{([\s\S]+?)}}}/g,
};
function parseTemplate(template, contentPlaceholder = '<div id="root"></div>') {
    if (typeof template === 'object') {
        return template;
    }
    let i = template.indexOf('</head>');
    const j = template.indexOf(contentPlaceholder);
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
