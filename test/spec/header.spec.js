import { expect } from 'chai';
import sinon from 'sinon';

import header from '../../src/header';

describe('header', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      setHeader: sinon.spy(),
    };
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
  });

  it('should call next request', (done) => {
    const app = header()(next);
    app.request(req, res).then(() => {
      expect(next.request).to.be.calledWith(req, res);
      done();
    });
  });

  it('should call res.setHeader', (done) => {
    const app = header('foo', 'bar')(next);
    app.request(req, res).then(() => {
      expect(res.setHeader).to.be.calledWith('foo', 'bar');
      done();
    });
  });

  it('should call function argument', (done) => {
    const handler = sinon.spy(() => 'bar');
    const app = header('foo', handler)(next);
    app.request(req, res).then(() => {
      expect(handler).to.be.calledWith(req);
      expect(res.setHeader).to.be.calledWith('foo', 'bar');
      done();
    });
  });

  it('should not call setHeader if value is falsy', (done) => {
    const app = header('foo', false)(next);
    app.request(req, res).then(() => {
      expect(res.setHeader).to.not.have.been.called;
      done();
    });
  });

  it('should call next error', (done) => {
    const err = new Error();
    const handler = () => {
      throw err;
    };
    const app = header('foo', handler)(next);
    app.request(req, res).then(() => {
      expect(next.error).to.be.calledWith(err, req, res);
      expect(res.setHeader).to.not.have.been.called;
      done();
    });
  });
});
