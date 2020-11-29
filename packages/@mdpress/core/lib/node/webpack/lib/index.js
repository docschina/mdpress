'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var create_bundle_renderer_1 = require('./bundle-renderer/create-bundle-renderer');
var create_renderer_1 = require('./create-renderer');
exports.createRenderer = create_renderer_1.createRenderer;
process.env.REACT_ENV = 'server';
exports.createBundleRenderer = create_bundle_renderer_1.createBundleRendererCreator(create_renderer_1.createRenderer);
//# sourceMappingURL=index.js.map