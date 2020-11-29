'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
var path_1 = __importDefault(require('path'));
var util_1 = require('../util');
var create_async_file_mapper_1 = require('./create-async-file-mapper');
var parse_template_1 = require('./parse-template');
var template_stream_1 = __importDefault(require('./template-stream'));
var serialize_javascript_1 = __importDefault(require('serialize-javascript'));
var TemplateRenderer = /** @class */ (function () {
  function TemplateRenderer(options) {
    this.options = options;
    this.inject = options.inject !== false;
    // if no template option is provided, the renderer is created
    // as a utility object for rendering assets like preload links and scripts.
    this.parsedTemplate = options.template
      ? parse_template_1.parseTemplate(options.template,options.contentPlaceholder)
      : null;
    // extra functionality with client manifest
    if (options.clientManifest) {
      var clientManifest = (this.clientManifest = options.clientManifest);
      this.publicPath = clientManifest.publicPath.replace(/\/$/, '');
      // preload/prefetch directives
      this.preloadFiles = (clientManifest.initial || []).map(normalizeFile);
      this.prefetchFiles = (clientManifest.async || []).map(normalizeFile);
      // initial async chunk mapping
      this.mapFiles = create_async_file_mapper_1.createMapper(clientManifest);
    }
  }
  TemplateRenderer.prototype.bindRenderFns = function (context) {
    var renderer = this;
    ['ResourceHints', 'State', 'Scripts', 'Styles'].forEach(function (type) {
      context['render' + type] = renderer['render' + type].bind(renderer, context);
    });
    // also expose getPreloadFiles, useful for HTTP/2 push
    context.getPreloadFiles = renderer.getPreloadFiles.bind(renderer, context);
  };
  // render synchronously given rendered app content and render context
  TemplateRenderer.prototype.renderSync = function (content, context) {
    if (context === void 0) { context = {}; }
    var template = this.parsedTemplate;
    if (!template) {
      throw new Error('renderSync cannot be called without a template.');
    }
    content = '<div id="root">' + content + '</div>';
    if (this.inject) {
      var asyncContext = context.asyncContext;
      if (asyncContext) {
        content += '<script>window.ASYNC_COMPONENTS_STATE=' + serialize_javascript_1.default(asyncContext.getState()) + '</script>';
      }
      return (template.head(context) +
                (context.head || '') +
                this.renderResourceHints(context) +
                this.renderStyles(context) +
                template.neck(context) +
                content +
                this.renderState(context) +
                this.renderScripts(context) +
                template.tail(context));
    }
    else {
      return (template.head(context) +
                template.neck(context) +
                content +
                template.tail(context));
    }
  };
  TemplateRenderer.prototype.renderStyles = function (context) {
    var _this = this;
    var cssFiles = this.clientManifest
      ? this.clientManifest.all.filter(util_1.isCSS)
      : [];
    return (
    // render links for css files
      (cssFiles.length
        ? cssFiles
          .map(function (file) {
            return '<link rel="stylesheet" href="' + _this.publicPath + '/' + file + '">';
          })
          .join('')
        : '') +
            // context.styles is a getter exposed by react-style-loader which contains
            // the inline component styles collected during SSR
            (context.styles || ''));
  };
  TemplateRenderer.prototype.renderResourceHints = function (context) {
    return this.renderPreloadLinks(context) + this.renderPrefetchLinks(context);
  };
  TemplateRenderer.prototype.getPreloadFiles = function (context) {
    var usedAsyncFiles = this.getUsedAsyncFiles(context);
    if (this.preloadFiles || usedAsyncFiles) {
      return (this.preloadFiles || []).concat(usedAsyncFiles || []);
    }
    else {
      return [];
    }
  };
  TemplateRenderer.prototype.renderPreloadLinks = function (context) {
    var _this = this;
    var files = this.getPreloadFiles(context);
    var shouldPreload = this.options.shouldPreload;
    if (files.length) {
      return files
        .map(function (_a) {
          var file = _a.file, extension = _a.extension, fileWithoutQuery = _a.fileWithoutQuery, asType = _a.asType;
          var extra = '';
          // by default, we only preload scripts or css
          if (!shouldPreload && asType !== 'script' && asType !== 'style') {
            return '';
          }
          // user wants to explicitly control what to preload
          if (shouldPreload && !shouldPreload(fileWithoutQuery, asType)) {
            return '';
          }
          if (asType === 'font') {
            extra = ' type="font/' + extension + '" crossorigin';
          }
          return '<link rel="preload" href="' + _this.publicPath + '/' + file + '"' + (asType !== '' ? ' as="' + asType + '"' : '') + extra + '>';
        })
        .join('');
    }
    else {
      return '';
    }
  };
  TemplateRenderer.prototype.renderPrefetchLinks = function (context) {
    var _this = this;
    var shouldPrefetch = this.options.shouldPrefetch;
    if (this.prefetchFiles) {
      var usedAsyncFiles_1 = this.getUsedAsyncFiles(context);
      var alreadyRendered_1 = function (file) {
        return usedAsyncFiles_1 && usedAsyncFiles_1.some(function (f) { return f.file === file; });
      };
      return this.prefetchFiles
        .map(function (_a) {
          var file = _a.file, fileWithoutQuery = _a.fileWithoutQuery, asType = _a.asType;
          if (shouldPrefetch && !shouldPrefetch(fileWithoutQuery, asType)) {
            return '';
          }
          if (alreadyRendered_1(file)) {
            return '';
          }
          return '<link rel="prefetch" href="' + _this.publicPath + '/' + file + '">';
        })
        .join('');
    }
    else {
      return '';
    }
  };
  TemplateRenderer.prototype.renderState = function (context, options) {
    var _a = options || {}, _b = _a.contextKey, contextKey = _b === void 0 ? 'state' : _b, _c = _a.windowKey, windowKey = _c === void 0 ? '__INITIAL_STATE__' : _c;
    var state = serialize_javascript_1.default(context[contextKey], { isJSON: true });
    var autoRemove = process.env.NODE_ENV === 'production'
      ? ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());'
      : '';
    return context[contextKey]
      ? '<script>window.' + windowKey + '=' + state + autoRemove + '</script>'
      : '';
  };
  TemplateRenderer.prototype.renderScripts = function (context) {
    var _this = this;
    if (this.clientManifest) {
      var initial = this.preloadFiles;
      var async = this.getUsedAsyncFiles(context);
      var needed = [initial[0]].concat(async || [], initial.slice(1));
      return needed
        .filter(function (_a) {
          var file = _a.file;
          return util_1.isJS(file);
        })
        .map(function (_a) {
          var file = _a.file;
          return '<script src="' + _this.publicPath + '/' + file + '" defer></script>';
        })
        .join('');
    }
    else {
      return '';
    }
  };
  TemplateRenderer.prototype.getUsedAsyncFiles = function (context) {
    if (!context._mappedFiles &&
            context._registeredComponents &&
            this.mapFiles) {
      var registered = Array.from(context._registeredComponents);
      context._mappedFiles = this.mapFiles(registered).map(normalizeFile);
    }
    return context._mappedFiles;
  };
  // create a transform stream
  TemplateRenderer.prototype.createStream = function (context) {
    if (!this.parsedTemplate) {
      throw new Error('createStream cannot be called without a template.');
    }
    return new template_stream_1.default(this, this.parsedTemplate, context || {});
  };
  return TemplateRenderer;
}());
exports.default = TemplateRenderer;
function normalizeFile(file) {
  var withoutQuery = file.replace(/\?.*/, '');
  var extension = path_1.default.extname(withoutQuery).slice(1);
  return {
    file: file,
    extension: extension,
    fileWithoutQuery: withoutQuery,
    asType: getPreloadType(extension),
  };
}
function getPreloadType(ext) {
  if (ext === 'js') {
    return 'script';
  }
  else if (ext === 'css') {
    return 'style';
  }
  else if (/jpe?g|png|svg|gif|webp|ico/.test(ext)) {
    return 'image';
  }
  else if (/woff2?|ttf|otf|eot/.test(ext)) {
    return 'font';
  }
  else {
    // not exhausting all possibilities here, but above covers common cases
    return '';
  }
}
//# sourceMappingURL=index.js.map