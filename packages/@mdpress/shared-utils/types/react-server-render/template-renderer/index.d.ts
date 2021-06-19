import { UserContext } from '../util';
import { AsyncFileMapper } from './create-async-file-mapper';
import { ParsedTemplate } from './parse-template';
import TemplateStream from './template-stream';
export interface TemplateRendererOptions {
    template?: string;
    contentPlaceholder?: string;
    inject?: boolean;
    clientManifest?: ClientManifest;
    shouldPreload?: (file: string, type: string) => boolean;
    shouldPrefetch?: (file: string, type: string) => boolean;
}
export interface ClientManifest {
    publicPath: string;
    all: string[];
    initial: string[];
    async: string[];
    modules: {
        [id: string]: number[];
    };
    hasNoCssVersion?: {
        [file: string]: boolean;
    };
}
export interface Resource {
    file: string;
    extension: string;
    fileWithoutQuery: string;
    asType: string;
}
export default class TemplateRenderer {
    options: TemplateRendererOptions;
    inject: boolean;
    parsedTemplate: ParsedTemplate | null;
    publicPath: string;
    clientManifest: ClientManifest;
    preloadFiles: Resource[];
    prefetchFiles: Resource[];
    mapFiles: AsyncFileMapper;
    constructor(options: TemplateRendererOptions);
    bindRenderFns(context: UserContext): void;
    renderSync(content: string, context?: UserContext): string;
    renderStyles(context: {
        styles?: string;
    }): string;
    renderResourceHints(context: UserContext): string;
    getPreloadFiles(context: UserContext): Resource[];
    renderPreloadLinks(context: UserContext): string;
    renderPrefetchLinks(context: UserContext): string;
    renderState(context: UserContext, options?: {
        contextKey?: string;
        windowKey?: string;
    }): string;
    renderScripts(context: UserContext): string;
    getUsedAsyncFiles(context: UserContext): Resource[];
    createStream(context?: object): TemplateStream;
}
