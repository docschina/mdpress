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
    const content = fs.readFileSync('/react-ssr-client-manifest.json', 'utf-8');
    cb(JSON.parse(content));
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

const expectedHTMLWithManifest = (options: any = {}) =>
  '<html><head>' +
    // used chunks should have preload
    '<link rel="preload" href="/manifest.js" as="script">' +
    '<link rel="preload" href="/main.js" as="script">' +
    '<link rel="prefetch" href="/0.js">' +
    // images and fonts are only preloaded when explicitly asked for
    (options.preloadOtherAssets ? '<link rel="preload" href="/test.png" as="image">' : '') +
    (options.preloadOtherAssets ? '<link rel="preload" href="/test.woff2" as="font" type="font/woff2" crossorigin>' : '') +
    // unused chunks should have prefetch
    (options.noPrefetch ? '' : '<link rel="prefetch" href="/1.js">') +
    // css assets should be loaded
    '<link rel="prefetch" href="/test.css">' +
    '<link rel="stylesheet" href="/test.css">' +
    '</head><body>' +
    '<!--ssr-outlet--><div id="root"><div data-reactroot=""><div>async test.woff2 test.png</div></div></div>' +
    // state should be inlined before scripts
    `<script>window.${options.stateKey || '__INITIAL_STATE__'}={"a":1}</script>` +
    // manifest chunk should be first
    '<script src="/manifest.js" defer></script>' +
    // async chunks should be before main chunk
    // '<script src="/0.js" defer></script>' +
    '<script src="/main.js" defer></script>' +
    '</body></html>';

function createClientManifestAssertions (runInNewContext) {
  it('bundleRenderer + renderToString + clientManifest ()', () => { return new Promise(done => {
    createRendererWithManifest('split.js', { runInNewContext }, renderer => {
      renderer.renderToString({ state: { a: 1 } }, (err, res) => {
        expect(err).toBeNull();
        expect(res).toContain(expectedHTMLWithManifest());
        done();
      });
    });
  }); });
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

  it('renderToString with interpolation', () => { return new Promise(done => {
    const renderer = createRenderer({
      template: interpolateTemplate
    });

    const context = {
      title: '<script>hacks</script>',
      snippet: '<div>foo</div>',
      head: '<meta name="viewport" content="width=device-width">',
      styles: '<style>h1 { color: red }</style>',
      state: { a: 1 }
    };

    renderer.renderToString && renderer.renderToString(React.createElement('div', null, 'hi'), context, (err, res) => {
      expect(err).toBeNull();
      expect(res).toContain(
        '<html><head>' +
          // double mustache should be escaped
          '<title>&lt;script&gt;hacks&lt;/script&gt;</title>' +
          `${context.head}${context.styles}</head><body>` +
          '<!--ssr-outlet--><div id="root"><div data-reactroot="">hi</div></div>' +
          '<script>window.__INITIAL_STATE__={"a":1}</script>' +
          // triple should be raw
          '<div>foo</div>' +
          '</body></html>'
      );
      done();
    });
  }); });

  it('renderToStream', () => { return new Promise(done => {
    const renderer = createRenderer({
      template: defaultTemplate
    });

    const context = {
      head: '<meta name="viewport" content="width=device-width">',
      styles: '<style>h1 { color: red }</style>',
      state: { a: 1 }
    };

    const stream = renderer.renderToStream(React.createElement('div', null, 'hi'), context);

    let res = '';
    stream.on('data', chunk => {
      res += chunk;
    });
    stream.on('end', () => {
      expect(res).toContain(
        `<html><head>${context.head}${context.styles}</head><body>` +
          '<!--ssr-outlet--><div id="root"><div data-reactroot="">hi</div></div>' +
          '<script>window.__INITIAL_STATE__={"a":1}</script>' +
          '</body></html>'
      );
      done();
    });
  }); });
  it('renderToStream with interpolation', () => { return new Promise(done => {
    const renderer = createRenderer({
      template: interpolateTemplate
    });

    const context = {
      title: '<script>hacks</script>',
      snippet: '<div>foo</div>',
      head: '<meta name="viewport" content="width=device-width">',
      styles: '<style>h1 { color: red }</style>',
      state: { a: 1 }
    };

    const stream = renderer.renderToStream(React.createElement('div', null, 'hi'), context);

    let res = '';
    stream.on('data', chunk => {
      res += chunk;
    });
    stream.on('end', () => {
      expect(res).toContain(
        '<html><head>' +
          // double mustache should be escaped
          '<title>&lt;script&gt;hacks&lt;/script&gt;</title>' +
          `${context.head}${context.styles}</head><body>` +
          '<!--ssr-outlet--><div id="root"><div data-reactroot="">hi</div></div>' +
          '<script>window.__INITIAL_STATE__={"a":1}</script>' +
          // triple should be raw
          '<div>foo</div>' +
          '</body></html>'
      );
      done();
    });
  }); });

  createClientManifestAssertions(true);
  createClientManifestAssertions(false);
});