"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const util_1 = require("../util");
const create_async_file_mapper_1 = require("./create-async-file-mapper");
const parse_template_1 = require("./parse-template");
const template_stream_1 = __importDefault(require("./template-stream"));
const serialize_javascript_1 = __importDefault(require("serialize-javascript"));
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
function normalizeFile(file) {
    const withoutQuery = file.replace(/\?.*/, '');
    const extension = path_1.default.extname(withoutQuery).slice(1);
    return {
        file,
        extension,
        fileWithoutQuery: withoutQuery,
        asType: getPreloadType(extension),
    };
}
class TemplateRenderer {
    constructor(options) {
        this.options = options;
        this.inject = options.inject !== false;
        // if no template option is provided, the renderer is created
        // as a utility object for rendering assets like preload links and scripts.
        this.parsedTemplate = options.template
            ? parse_template_1.parseTemplate(options.template, options.contentPlaceholder)
            : null;
        // extra functionality with client manifest
        if (options.clientManifest) {
            const clientManifest = (this.clientManifest = options.clientManifest);
            this.publicPath = clientManifest.publicPath.replace(/\/$/, '');
            // preload/prefetch directives
            this.preloadFiles = (clientManifest.initial || []).map(normalizeFile);
            this.prefetchFiles = (clientManifest.async || []).map(normalizeFile);
            // initial async chunk mapping
            this.mapFiles = create_async_file_mapper_1.createMapper(clientManifest);
        }
    }
    bindRenderFns(context) {
        const renderer = this;
        ['ResourceHints', 'State', 'Scripts', 'Styles'].forEach(type => {
            context[`render${type}`] = renderer[`render${type}`].bind(renderer, context);
        });
        // also expose getPreloadFiles, useful for HTTP/2 push
        context.getPreloadFiles = renderer.getPreloadFiles.bind(renderer, context);
    }
    // render synchronously given rendered app content and render context
    renderSync(content, context = {}) {
        const template = this.parsedTemplate;
        if (!template) {
            throw new Error('renderSync cannot be called without a template.');
        }
        content = `<div id="root">${content}</div>`;
        if (this.inject) {
            const { asyncContext } = context;
            if (asyncContext) {
                content += `<script>window.ASYNC_COMPONENTS_STATE=${serialize_javascript_1.default(asyncContext.getState())}</script>`;
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
    }
    renderStyles(context) {
        const cssFiles = this.clientManifest
            ? this.clientManifest.all.filter(util_1.isCSS)
            : [];
        return (
        // render links for css files
        (cssFiles.length
            ? cssFiles
                .map(file => `<link rel="stylesheet" href="${this.publicPath}/${file}">`)
                .join('')
            : '') +
            // context.styles is a getter exposed by react-style-loader which contains
            // the inline component styles collected during SSR
            (context.styles || ''));
    }
    renderResourceHints(context) {
        return this.renderPreloadLinks(context) + this.renderPrefetchLinks(context);
    }
    getPreloadFiles(context) {
        const usedAsyncFiles = this.getUsedAsyncFiles(context);
        if (this.preloadFiles || usedAsyncFiles) {
            return (this.preloadFiles || []).concat(usedAsyncFiles || []);
        }
        else {
            return [];
        }
    }
    renderPreloadLinks(context) {
        const files = this.getPreloadFiles(context);
        const shouldPreload = this.options.shouldPreload;
        if (files.length) {
            return files
                .map(({ file, extension, fileWithoutQuery, asType }) => {
                let extra = '';
                // by default, we only preload scripts or css
                if (!shouldPreload && asType !== 'script' && asType !== 'style') {
                    return '';
                }
                // user wants to explicitly control what to preload
                if (shouldPreload && !shouldPreload(fileWithoutQuery, asType)) {
                    return '';
                }
                if (asType === 'font') {
                    extra = ` type="font/${extension}" crossorigin`;
                }
                return `<link rel="preload" href="${this.publicPath}/${file}"${asType !== '' ? ` as="${asType}"` : ''}${extra}>`;
            })
                .join('');
        }
        else {
            return '';
        }
    }
    renderPrefetchLinks(context) {
        const shouldPrefetch = this.options.shouldPrefetch;
        if (this.prefetchFiles) {
            const usedAsyncFiles = this.getUsedAsyncFiles(context);
            const alreadyRendered = file => {
                return usedAsyncFiles && usedAsyncFiles.some(f => f.file === file);
            };
            return this.prefetchFiles
                .map(({ file, fileWithoutQuery, asType }) => {
                if (shouldPrefetch && !shouldPrefetch(fileWithoutQuery, asType)) {
                    return '';
                }
                if (alreadyRendered(file)) {
                    return '';
                }
                return `<link rel="prefetch" href="${this.publicPath}/${file}">`;
            })
                .join('');
        }
        else {
            return '';
        }
    }
    renderState(context, options) {
        const { contextKey = 'state', windowKey = '__INITIAL_STATE__' } = options || {};
        const state = serialize_javascript_1.default(context[contextKey]);
        const autoRemove = process.env.NODE_ENV === 'production'
            ? ';(function(){var s;(s=document.currentScript||document.scripts[document.scripts.length-1]).parentNode.removeChild(s);}());'
            : '';
        const nonceAttr = context.nonce ? ` nonce="${context.nonce}"` : '';
        return context[contextKey]
            ? `<script${nonceAttr}>window.${windowKey}=${state}${autoRemove}</script>`
            : '';
    }
    renderScripts(context) {
        if (this.clientManifest) {
            const initial = this.preloadFiles;
            const async = this.getUsedAsyncFiles(context);
            const needed = [initial[0]].concat(async || [], initial.slice(1));
            return needed
                .filter(({ file }) => util_1.isJS(file))
                .map(({ file }) => {
                return `<script src="${this.publicPath}/${file}" defer></script>`;
            })
                .join('');
        }
        else {
            return '';
        }
    }
    getUsedAsyncFiles(context) {
        if (!context._mappedFiles &&
            context._registeredComponents &&
            this.mapFiles) {
            const registered = Array.from(context._registeredComponents);
            context._mappedFiles = this.mapFiles(registered).map(normalizeFile);
        }
        return context._mappedFiles;
    }
    // create a transform stream
    createStream(context) {
        if (!this.parsedTemplate) {
            throw new Error('createStream cannot be called without a template.');
        }
        return new template_stream_1.default(this, this.parsedTemplate, context || {});
    }
}
exports.default = TemplateRenderer;
