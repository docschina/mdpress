'use strict';
/* eslint-disable*/
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var stream_1 = require('stream');
var serialize_javascript_1 = __importDefault(require('serialize-javascript'));
var TemplateStream = /** @class */ (function (_super) {
  __extends(TemplateStream, _super);
  function TemplateStream(renderer, template, context) {
    var _this = _super.call(this) || this;
    _this.started = false;
    _this.renderer = renderer;
    _this.template = template;
    _this.context = context || {};
    _this.inject = renderer.inject;
    return _this;
  }
  TemplateStream.prototype._transform = function (data, _encoding, done) {
    if (!this.started) {
      this.emit('beforeStart');
      this.start();
    }
    this.push(data);
    done();
  };
  TemplateStream.prototype.start = function () {
    this.started = true;
    this.push(this.template.head(this.context));
    if (this.inject) {
      // inline server-rendered head meta information
      if (this.context.head) {
        this.push(this.context.head);
      }
      // inline preload/prefetch directives for initial/async chunks
      var links = this.renderer.renderResourceHints(this.context);
      if (links) {
        this.push(links);
      }
      // CSS files and inline server-rendered CSS collected by react-style-loader
      var styles = this.renderer.renderStyles(this.context);
      if (styles) {
        this.push(styles);
      }
    }
    this.push(this.template.neck(this.context));
    if (this.inject) {
      this.push('<div id="root">');
    }
  };
  TemplateStream.prototype._flush = function (done) {
    this.emit('beforeEnd', this.started);
    if (!this.started) {
      done();
      return;
    }
    if (this.inject) {
      this.push('</div>');
      var asyncContext = this.context.asyncContext;
      if (asyncContext) {
        this.push('<script>window.ASYNC_COMPONENTS_STATE=' + serialize_javascript_1.default(asyncContext.getState()) + '</script>');
      }
      // inline initial store state
      var state = this.renderer.renderState(this.context);
      if (state) {
        this.push(state);
      }
      // embed scripts needed
      var scripts = this.renderer.renderScripts(this.context);
      if (scripts) {
        this.push(scripts);
      }
    }
    this.push(this.template.tail(this.context));
    done();
  };
  return TemplateStream;
}(stream_1.Transform));
exports.default = TemplateStream;
//# sourceMappingURL=template-stream.js.map