import { createBundleRendererCreator } from './bundle-renderer/create-bundle-renderer';
import { createRenderer } from './create-renderer';
import { ReactSSRClientPlugin } from './webpack-plugin/client';
import { ReactSSRServerPlugin } from './webpack-plugin/server';

process.env.REACT_ENV = 'server';

export { createRenderer,ReactSSRClientPlugin,ReactSSRServerPlugin };

export const createBundleRenderer = createBundleRendererCreator(createRenderer);
