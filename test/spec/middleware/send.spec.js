import { expect } from 'chai';
import sinon from 'sinon';

import send from '../../../src/middleware/send';

describe('send', () => {
  let res;
  let req;

  beforeEach(() => {
    req = { body: 'body' };
    res = {
      end: sinon.spy(),
      setHeader: sinon.spy(),
    };
  });

  it('should call `res.end` with `res.body`', () => {
    const app = send()();
    app.request(req, res);
    expect(res.setHeader).to.be
      .calledWith('Content-Type', 'text/html; charset=utf-8');
    expect(res.end).to.be.calledWith(req.body);
  });

  it('should call `res.end` with constant value', () => {
    const app = send({ body: 'constant' })();
    app.request(req, res);
    expect(res.setHeader).to.be
      .calledWith('Content-Type', 'text/html; charset=utf-8');
    expect(res.end).to.be.calledWith('constant');
  });

  it('should set `Content-Type` header with constant value', () => {
    const app = send({ type: 'constant' })();
    app.request(req, res);
    expect(res.setHeader).to.be
      .calledWith('Content-Type', 'constant');
    expect(res.end).to.be.calledWith('body');
  });

  it('should not set `Content-Type` header if type is falsy', () => {
    const app = send({ type: false })();
    app.request(req, res);
    expect(res.setHeader).not.to.have.been.called;
    expect(res.end).to.be.calledWith('body');
  });
});

