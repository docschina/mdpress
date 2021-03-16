import { createRenderer } from './util';

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

  it('renderToStream', () => { return new Promise(done => {
    createRenderer('app.js', { runInNewContext }, renderer => {
      const context: any = { url: '/test' };
      const stream = renderer.renderToStream(context);
      let res = '';
      stream.on('data', chunk => {
        res += chunk.toString();
      });
      stream.on('end', () => {
        expect(res).toBe('<div data-reactroot="">/test</div>');
        expect(context.msg).toBe('hello');
        done();
      });
    });
  }); });

  it('renderToString catch error', () => { return new Promise(done => {
    createRenderer('error.js', { runInNewContext }, renderer => {
      renderer.renderToString(err => {
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });

  it('renderToString catch Promise rejection', () => { return new Promise(done => {
    createRenderer('promise-rejection.js', { runInNewContext }, renderer => {
      renderer.renderToString(err => {
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });

  it('renderToStream catch error', () => { return new Promise(done => {
    createRenderer('error.js', { runInNewContext }, renderer => {
      const stream = renderer.renderToStream();
      stream.on('error', err => {
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });

  it('renderToStream catch Promise rejection', () => { return new Promise(done => {
    createRenderer('promise-rejection.js', { runInNewContext }, renderer => {
      const stream = renderer.renderToStream();
      stream.on('error', err => {
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });

  it('renderToString (bundle format with code split)', () => { return new Promise(done => {
    createRenderer('split.js', { runInNewContext, asBundle: true }, renderer => {
      const context = { url: '/test' };
      renderer.renderToString(context, (err, res) => {
        expect(err).toBeNull();
        expect(res).toBe('<div data-reactroot="">/test<div>async foo</div></div>');
        done();
      });
    });
  }); });

  it('renderToString catch error (bundle format with source map)', () => { return new Promise(done => {
    createRenderer('error.js', { runInNewContext, asBundle: true }, renderer => {
      renderer.renderToString(err => {
        expect(err.stack).toContain('fixtures/error.js:1:6');
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });

  it('renderToString return Promise', () => { return new Promise(done => {
    createRenderer('app.js', { runInNewContext }, renderer => {
      const context: any = { url: '/test' };
      renderer.renderToString(context).then(res => {
        expect(res).toBe('<div data-reactroot="">/test</div>');
        expect(context.msg).toBe('hello');
        done();
      });
    });
  }); });

  it('renderToString return Promise (error)', () => { return new Promise(done => {
    createRenderer('error.js', { runInNewContext }, renderer => {
      renderer.renderToString().catch(err => {
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });

  it('renderToString return Promise (Promise rejection)', () => { return new Promise(done => {
    createRenderer('promise-rejection.js', { runInNewContext }, renderer => {
      renderer.renderToString().catch(err => {
        expect(err.message).toBe('foo');
        done();
      });
    });
  }); });
}

describe('SSR: bundle renderer', () => {
  createAssertions(true);
  createAssertions(false);
});