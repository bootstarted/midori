import {expect} from 'chai';
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

  it('should call next request', () => {
    const app = header()(next);
    app.request(req, res);
    expect(next.request).to.be.calledWith(req, res);
  });

  it('should call res.setHeader', () => {
    const app = header('foo', 'bar')(next);
    app.request(req, res);
    expect(res.setHeader).to.be.calledWith('foo', 'bar');
  });

  it('should call function argument', () => {
    const handler = sinon.spy(() => 'bar');
    const app = header('foo', handler)(next);
    app.request(req, res);
    expect(handler).to.be.calledWith(req);
    expect(res.setHeader).to.be.calledWith('foo', 'bar');
  });

  it('should not call setHeader if value is falsy', () => {
    const app = header('foo', false)(next);
    app.request(req, res);
    expect(res.setHeader).to.not.have.been.called;
  });

  it('should work with promises', () => {
    const app = header('foo', Promise.resolve('bar'))(next);
    return app.request(req, res).then(() => {
      expect(res.setHeader).to.be.calledWith('foo', 'bar');
    });
  });

  it('should fail for invalid values', () => {
    expect(() => {
      header('foo', {});
    }).to.throw(TypeError);
  });

  it('should call next error', () => {
    const err = new Error();
    const handler = () => {
      throw err;
    };
    const app = header('foo', handler)(next);
    app.request(req, res);
    expect(next.error).to.be.calledWith(err, req, res);
    expect(res.setHeader).to.not.have.been.called;
  });
});
