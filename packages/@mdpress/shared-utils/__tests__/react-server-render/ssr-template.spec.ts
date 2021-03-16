import React from 'react';
import { compileWithWebpack } from './compile-with-webpack';
import { createRenderer } from '../../src/react-server-render';
import { ReactSSRClientPlugin } from '../../src/react-server-render/webpack-plugin/client';
import { createRenderer as createBundleRenderer } from './util';

const defaultTemplate = '<html><head></head><body><!--ssr-outlet--><div id="root"></div></body></html>';
const interpolateTemplate = '<html><head><title>{{ title }}</title></head><body><!--ssr-outlet--><div id="root"></div>{{{ snippet }}}</body></html>';

function generateClientManifest (file, cb) {
  compileWithWebpack(file, {
    output: {
      path: '/',
      publicPath: '/',
      filename: '[name].js'
    },
    optimization: {
      runtimeChunk: {
        name: 'manifest'
      }
    },
    plugins: [
      new ReactSSRClientPlugin()
    ]
  }, fs => {
    cb(JSON.parse(fs.readFileSync('/react-ssr-client-manifest.json', 'utf-8')));
  });
}

function createRendererWithManifest (file, options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = null;
  }
  generateClientManifest(file, clientManifest => {
    createBundleRenderer(file, Object.assign({
      asBundle: true,
      template: defaultTemplate,
      clientManifest
    }, options), cb);
  });
}

describe('SSR: template option', () => {
  it('renderToString', () => { return new Promise(done => {
    const renderer = createRenderer({
      template: defaultTemplate
    });

    const context = {
      head: '<meta name="viewport" content="width=device-width">',
      styles: '<style>h1 { color: red }</style>',
      state: { a: 1 }
    };

    renderer.renderToString && renderer.renderToString(React.createElement('div', null, 'hi'), context, (err, res) => {
      expect(err).toBeNull();
      expect(res).toContain(
        `<html><head>${context.head}${context.styles}</head><body>` +
          '<!--ssr-outlet--><div id="root"><div data-reactroot="">hi</div></div>' +
          '<script>window.__INITIAL_STATE__={"a":1}</script>' +
          '</body></html>'
      );
      done();
    });
  }); });
});