import { expect } from 'chai';
import sinon from 'sinon';

import status from '../../../src/middleware/status';

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

  it('should call next request', (done) => {
    const app = status()(next);
    app.request(req, res).then(() => {
      expect(next.request).to.be.calledWith(req, res);
      done();
    });
  });

  it('should set res.statusCode', (done) => {
    const app = status(200)(next);
    app.request(req, res).then(() => {
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  it('should call function argument', (done) => {
    const handler = sinon.spy(() => 200);
    const app = status(handler)(next);
    app.request(req, res).then(() => {
      expect(handler).to.be.calledWith(req);
      expect(res.statusCode).to.be.equal(200);
      done();
    });
  });

  it('should not set res.statusCode if value is falsy', (done) => {
    const app = status(false)(next);
    app.request(req, res).then(() => {
      expect(res.statusCode).to.be.be.undefined;
      done();
    });
  });

  it('should call next error', (done) => {
    const err = new Error();
    const handler = () => {
      throw err;
    };
    const app = status(handler)(next);
    app.request(req, res).then(() => {
      expect(next.error).to.be.calledWith(err, req, res);
      expect(res.statusCode).to.be.be.undefined;
      done();
    });
  });
});
