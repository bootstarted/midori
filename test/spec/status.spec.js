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
});
