// import LRU from 'lru-cache';
import { compileWithWebpack } from './compile-with-webpack';
import { createBundleRenderer } from '../../src/react-server-render';
import { ReactSSRServerPlugin } from '../../src/react-server-render/webpack-plugin/server';

function createRenderer (file, options, cb) {
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
      ? JSON.parse(fs.readFileSync('/vue-ssr-server-bundle.json', 'utf-8'))
      : fs.readFileSync('/bundle.js', 'utf-8');
    const renderer = createBundleRenderer(bundle, options);
    cb(renderer);
  });
}

function createAssertions (runInNewContext) {
  it('renderToString', () => { return new Promise(done => {
    createRenderer('app.js', { runInNewContext }, renderer => {
      const context: any = { url: '/test' };

      renderer.renderToString(context, (err, res) => {
        expect(err).toBeNull();
        expect(res).toBe('<div data-reactroot="">/test</div>');
        expect(context.msg).toBe('hello');
        done();
      });
    });
  }); });
}

describe('SSR: bundle renderer', () => {
  createAssertions(true);
  createAssertions(false);
});