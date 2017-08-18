import sinon from 'sinon';
import bl from 'bl';
import onFinished from 'on-finished';

import serve from '../../src/serve';

describe('serve', () => {
  it('should serve some files', (done) => {
    const spy = sinon.spy();
    const getHeader = sinon.stub().returns('');
    const setHeader = sinon.stub();
    const stream = bl(() => {});
    const app = serve({root: __dirname})({
      request: spy,
      error: done,
    });
    stream.getHeader = getHeader;
    stream.setHeader = setHeader;
    onFinished(stream, (err) => {
      // FIXME: This appears to be called out of order...
      // expect(stream.setHeader).to.be.called;
      done(err);
    });
    app.request({url: '/serve.spec.js', headers: {}, method: 'GET'}, stream);
  });

  it('should work with path prefixes', (done) => {
    const spy = sinon.spy();
    const getHeader = sinon.stub().returns('');
    const setHeader = sinon.stub();
    const stream = bl(() => {});
    const app = serve({root: __dirname})({
      request: spy,
      error: done,
    });
    stream.getHeader = getHeader;
    stream.setHeader = setHeader;
    // fs.createReadStream('./base.js').pipe(stream);
    app.request({
      url: '/foo/serve.spec.js',
      path: '/foo',
      headers: {},
      method: 'GET',
    }, stream);
    onFinished(stream, (err) => {
      // FIXME: This appears to be called out of order...
      // expect(stream.setHeader).to.be.called;
      done(err);
    });
  });
});
