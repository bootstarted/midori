import {expect} from 'chai';
import sinon from 'sinon';

import status from '../../src/status';

describe('status', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    req = {};
    res = {};
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
  });

  it('should call next request', () => {
    const app = status(300)(next);
    app.request(req, res);
    expect(next.request).to.be.calledWith(req, res);
  });

  it('should set res.statusCode', () => {
    const app = status(200)(next);
    app.request(req, res);
    expect(res.statusCode).to.be.equal(200);
  });

  it('should work with promises', () => {
    const app = status(Promise.resolve(200))(next);
    return app.request(req, res).then(() => {
      expect(res.statusCode).to.be.equal(200);
    });
  });

  it('should fail on invalid values', () => {
    expect(() => {
      status('foo');
    }).to.throw(TypeError);
  });

  it('should call function argument', () => {
    const handler = sinon.spy(() => 200);
    const app = status(handler)(next);
    app.request(req, res);
    expect(handler).to.be.calledWith(req);
    expect(res.statusCode).to.be.equal(200);
  });

  it('should call next error', () => {
    const err = new Error();
    const handler = () => {
      throw err;
    };
    const app = status(handler)(next);
    app.request(req, res);
    expect(next.error).to.be.calledWith(err, req, res);
    expect(res.statusCode).to.be.be.undefined;
  });
});
