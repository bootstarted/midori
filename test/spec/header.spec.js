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
});
