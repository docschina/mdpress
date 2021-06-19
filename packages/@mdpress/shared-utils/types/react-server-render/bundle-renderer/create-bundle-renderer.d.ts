/// <reference types="node" />
import { PassThrough } from 'stream';
import { RenderOptions, Renderer } from '../create-renderer';
import { UserContext } from '../util';
export interface RenderBundle {
    basedir?: string;
    entry: string;
    files: {
        [filename: string]: string;
    };
    maps: {
        [filename: string]: string;
    };
    modules?: {
        [filename: string]: string[];
    };
}
export declare function createBundleRendererCreator(createRenderer: (options?: RenderOptions) => Renderer): (bundle: string | RenderBundle, rendererOptions?: RenderOptions) => {
    renderToString: (context?: UserContext | undefined, cb?: any) => any;
    renderToStream: (context?: UserContext) => PassThrough;
};
