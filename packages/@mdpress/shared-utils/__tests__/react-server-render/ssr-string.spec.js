import React from 'react';
import { createRenderer } from '../../src/react-server-render';
const { renderToString } = createRenderer();

function render (comp, cb) {
  renderToString && renderToString(comp, {},(err, res) => {
    expect(err).toBeNull();
    cb(res);
  });
}
describe('SSR: renderToString', () => {
  it('static attributes', () => { return new Promise(done => {

    render(<div id="foo" bar="123"></div>, result => {
      expect(result).toContain('<div id="foo" bar="123" data-reactroot=""></div>');
      done();
    });
  }); });

  it('unary tags', () => { return new Promise(done => {
    render(<input value="123"/>, result => {
      expect(result).toContain('<input value="123" data-reactroot=""/>');
      done();
    });
  }); });
});