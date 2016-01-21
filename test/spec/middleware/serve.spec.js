import { expect } from 'chai';
import sinon from 'sinon';
import bl from 'bl';

import serve from '../../../src/middleware/serve';

describe('serve', () => {
  it('should serve some files', (done) => {
    const spy = sinon.spy();
    const getHeader = sinon.stub().returns('');
    const setHeader = sinon.stub();
    const stream = bl(() => {});
    const app = serve({ root: __dirname })({
      request: spy,
      error: spy,
    });
    stream.getHeader = getHeader;
    stream.setHeader = setHeader;
    // fs.createReadStream('./base.js').pipe(stream);
    app.request({ url: '/serve.spec.js', headers: {}, method: 'GET' }, stream);
    setTimeout(() => {
      expect(stream.setHeader).to.be.called;
      done();
    }, 2);
  });

  it('should work with path prefixes', (done) => {
    const spy = sinon.spy();
    const getHeader = sinon.stub().returns('');
    const setHeader = sinon.stub();
    const stream = bl(() => {});
    const app = serve({ root: __dirname })({
      request: spy,
      error: spy,
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
    setTimeout(() => {
      expect(stream.setHeader).to.be.called;
      done();
    }, 2);
  });
});
