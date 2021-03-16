import { compileWithWebpack } from './compile-with-webpack';
import { createBundleRenderer, ReactSSRServerPlugin } from '../../src/react-server-render';

export function createRenderer (file, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = undefined;
  }
  const asBundle = !!(options && options.asBundle);
  if (options) delete options.asBundle;

  compileWithWebpack(file, {
    target: 'node',
    devtool: asBundle ? '#source-map' : false,
    output: {
      path: '/',
      filename: 'bundle.js',
      libraryTarget: 'commonjs2'
    },
    externals: [/^react|react-router-dom$/],
    plugins: asBundle
      ? [new ReactSSRServerPlugin()]
      : []
  }, fs => {
    const bundle = asBundle
      ? JSON.parse(fs.readFileSync('/react-ssr-server-bundle.json', 'utf-8'))
      : fs.readFileSync('/bundle.js', 'utf-8');
    const renderer = createBundleRenderer(bundle, options);
    cb(renderer);
  });
}
