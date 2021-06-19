/// <reference types="node" />
import { createRenderer } from './create-renderer';
import { ReactSSRClientPlugin } from './webpack-plugin/client';
import { ReactSSRServerPlugin } from './webpack-plugin/server';
export { createRenderer, ReactSSRClientPlugin, ReactSSRServerPlugin };
export declare const createBundleRenderer: (bundle: string | import("./bundle-renderer/create-bundle-renderer").RenderBundle, rendererOptions?: import("./create-renderer").RenderOptions) => {
    renderToString: (context?: import("./util").UserContext | undefined, cb?: any) => any;
    renderToStream: (context?: import("./util").UserContext) => import("stream").PassThrough;
};
