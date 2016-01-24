import { expect } from 'chai';
import sinon from 'sinon';

import send from '../../../src/middleware/send';

describe('send', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    req = {
      body: 'body',
    };
    res = {
      end: sinon.spy(),
    };
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
  });

  it('should not call next request', (done) => {
    const app = send()(next);
    app.request(req, res).then(() => {
      expect(next.request).not.to.have.been.called;
      done();
    });
  });

  it('should call res.end with req.body', (done) => {
    const app = send()(next);
    app.request(req, res).then(() => {
      expect(res.end).to.be.calledWith(req.body);
      done();
    });
  });

  it('should call res.end with argument', (done) => {
    const app = send('test')(next);
    app.request(req, res).then(() => {
      expect(res.end).to.be.calledWith('test');
      done();
    });
  });

  it('should call function argument', (done) => {
    const handler = sinon.spy(() => 'bar');
    const app = send(handler)(next);
    app.request(req, res).then(() => {
      expect(handler).to.be.calledWith(req);
      expect(res.end).to.be.calledWith('bar');
      done();
    });
  });

  it('should call next error', (done) => {
    const err = new Error();
    const handler = () => {
      throw err;
    };
    const app = send(handler)(next);
    app.request(req, res).then(() => {
      expect(next.error).to.be.calledWith(err, req, res);
      expect(res.end).to.not.have.been.called;
      done();
    });
  });
});
