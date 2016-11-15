import { expect } from 'chai';
import sinon from 'sinon';

import redirect from '../../src/redirect';

describe('redirect', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      writeHead: sinon.spy(),
      end: sinon.spy(),
    };
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
  });

  it('should not call next request', () => {
    const app = redirect('/foo')(next);
    app.request(req, res);
    expect(next.request).to.be.not.called;
    expect(res.end).to.be.calledOnce;
  });

  it('should set the status code and url', () => {
    const app = redirect('/foo')(next);
    app.request(req, res);
    expect(res.writeHead).to.be.calledWithMatch(302, {
      Location: '/foo',
    });
  });

  it('should set the status code and url for functions', () => {
    const app = redirect(() => '/foo')(next);
    app.request(req, res);
    expect(res.writeHead).to.be.calledWithMatch(302, {
      Location: '/foo',
    });
  });

  it('should fail for invalid parameters', () => {
    expect(() => {
      redirect(false);
    }).to.throw(TypeError);
  });
});
