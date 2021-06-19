/// <reference types="node" />
import { TemplateRendererOptions } from './template-renderer';
import { UserContext } from './util';
import { ReactElement } from 'react';
export declare type RenderOptions = TemplateRendererOptions & {
    basedir?: string;
    runInNewContext?: false | 'once';
};
export interface Renderer {
    renderToString?: (component: ReactElement<any>, context: UserContext, cb: any) => Promise<string>;
    renderToStream: (component: ReactElement<any>, context: UserContext) => NodeJS.ReadableStream;
}
export declare function createRenderer(options?: TemplateRendererOptions): Renderer;
