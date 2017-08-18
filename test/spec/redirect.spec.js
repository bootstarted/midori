import {expect} from 'chai';
import sinon from 'sinon';
import url from 'url';

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

  it('should work with url objects', () => {
    const app = redirect(url.parse('http://www.something.com/foo'))(next);
    app.request(req, res);
    expect(res.writeHead).to.be.calledWithMatch(302, {
      Location: 'http://www.something.com/foo',
    });
  });

  it('should set the status code and url for functions', () => {
    const app = redirect(() => '/foo')(next);
    app.request(req, res);
    expect(res.writeHead).to.be.calledWithMatch(302, {
      Location: '/foo',
    });
  });

  it('should set the custom status code', () => {
    const app = redirect(304, () => '/foo')(next);
    app.request(req, res);
    expect(res.writeHead).to.be.calledWithMatch(304, {
      Location: '/foo',
    });
  });

  it('should fail eagerly for invalid parameters', () => {
    expect(() => {
      redirect(false);
    }).to.throw(TypeError);
  });

  it('should fail for invalid function results', () => {
    const app = redirect(() => false)(next);
    app.request(req, res);
    expect(next.error).to.be.called;
  });
});
