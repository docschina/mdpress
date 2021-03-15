"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
class TemplateStream extends stream_1.Transform {
    constructor(renderer, template, context) {
        super();
        this.started = false;
        this.renderer = renderer;
        this.template = template;
        this.context = context || {};
        this.inject = renderer.inject;
    }
    _transform(data, _encoding, done) {
        if (!this.started) {
            this.emit('beforeStart');
            this.start();
        }
        this.push(data);
        done();
    }
    start() {
        this.started = true;
        this.push(this.template.head(this.context));
        if (this.inject) {
            // inline server-rendered head meta information
            if (this.context.head) {
                this.push(this.context.head);
            }
            // inline preload/prefetch directives for initial/async chunks
            const links = this.renderer.renderResourceHints(this.context);
            if (links) {
                this.push(links);
            }
            // CSS files and inline server-rendered CSS collected by react-style-loader
            const styles = this.renderer.renderStyles(this.context);
            if (styles) {
                this.push(styles);
            }
        }
        this.push(this.template.neck(this.context));
        if (this.inject) {
            this.push('<div id="root">');
        }
    }
    _flush(done) {
        this.emit('beforeEnd', this.started);
        if (!this.started) {
            done();
            return;
        }
        if (this.inject) {
            this.push('</div>');
            const { asyncContext } = this.context;
            if (asyncContext) {
                this.push(`<script>window.ASYNC_COMPONENTS_STATE=${serialize_javascript_1.default(asyncContext.getState())}</script>`);
            }
            // inline initial store state
            const state = this.renderer.renderState(this.context);
            if (state) {
                this.push(state);
            }
            // embed scripts needed
            const scripts = this.renderer.renderScripts(this.context);
            if (scripts) {
                this.push(scripts);
            }
        }
        this.push(this.template.tail(this.context));
        done();
    }
}
exports.default = TemplateStream;
