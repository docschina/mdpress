"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRenderer = void 0;
const template_renderer_1 = __importDefault(require("./template-renderer"));
const util_1 = require("./util");
const server_1 = require("react-dom/server");
function createRenderer(options = {}) {
    const templateRenderer = new template_renderer_1.default(options);
    return {
        renderToString(component, context, cb) {
            if (typeof context === 'function') {
                cb = context;
                context = {};
            }
            if (context) {
                templateRenderer.bindRenderFns(context);
            }
            // no callback, return Promise
            let promise;
            if (!cb) {
                ({ promise, cb } = util_1.createPromiseCallback());
            }
            let result;
            try {
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
        renderToStream(component, context) {
            const renderStream = server_1.renderToNodeStream(component);
            process.nextTick(() => renderStream.emit('afterRender'));
            if (!options.template) {
                return renderStream;
            }
            templateRenderer.bindRenderFns(context);
            const templateStream = templateRenderer.createStream(context);
            renderStream
                .on('afterRender', () => templateStream.emit('afterRender'))
                .on('error', err => templateStream.emit('error', err))
                .pipe(templateStream);
            return templateStream;
        },
    };
}
exports.createRenderer = createRenderer;
