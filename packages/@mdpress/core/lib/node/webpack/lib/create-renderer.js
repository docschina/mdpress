'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var template_renderer_1 = __importDefault(require('./template-renderer'));
var util_1 = require('./util');
var server_1 = require('react-dom/server');
function createRenderer(options) {
  if (options === void 0) { options = {}; }
  var templateRenderer = new template_renderer_1.default(options);
  return {
    renderToString: function (component, context, cb) {
      var _a;
      if (typeof context === 'function') {
        cb = context;
        context = {};
      }
      if (context) {
        templateRenderer.bindRenderFns(context);
      }
      // no callback, return Promise
      var promise;
      if (!cb) {

        (_a = util_1.createPromiseCallback(), promise = _a.promise, cb = _a.cb);
      }
      var result;
      try {
        // debugger;
        result = server_1.renderToString(component);
        if (options.template) {
          result = templateRenderer.renderSync(result, context);
        }
        cb(null, result);
      }
      catch (e) {
        cb(e);
      }
      return promise;
    },
    renderToStream: function (component, context) {
      var renderStream = server_1.renderToNodeStream(component);
      process.nextTick(function () { return renderStream.emit('afterRender'); });
      if (!options.template) {
        return renderStream;
      }
      templateRenderer.bindRenderFns(context);
      var templateStream = templateRenderer.createStream(context);
      renderStream
        .on('afterRender', function () { return templateStream.emit('afterRender'); })
        .on('error', function (err) { return templateStream.emit('error', err); })
        .pipe(templateStream);
      return templateStream;
    },
  };
}
exports.createRenderer = createRenderer;
//# sourceMappingURL=create-renderer.js.map