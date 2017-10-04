import {expect} from 'chai';
import sinon from 'sinon';
import bl from 'bl';

import send from '../../src/send';

describe('send', () => {
  let res;
  let req;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      body: 'body',
      setHeader: sinon.spy(),
      end: sinon.spy(),
    };
    next = {
      request: sinon.spy(),
      error: sinon.spy(),
    };
  });

  it('should not call next request', () => {
    const app = send('foo')(next);
    app.request(req, res);
    expect(next.request).not.to.have.been.called;
  });

  it('should call res.end with argument', () => {
    const app = send('test')(next);
    app.request(req, res);
    expect(res.end).to.be.calledWith('test');
  });

  it('should call function argument', () => {
    const handler = sinon.spy(() => 'bar');
    const app = send(handler)(next);
    app.request(req, res);
    expect(handler).to.be.calledWith(req);
    expect(res.end).to.be.calledWith('bar');
  });

  it('should call next error', () => {
    const err = new Error();
    const handler = () => {
      throw err;
    };
    const app = send(handler)(next);
    app.request(req, res);
    expect(next.error).to.be.calledWith(err, req, res);
    expect(res.end).to.not.have.been.called;
  });

  it('should work with buffers', () => {
    const data = new Buffer('hello');
    const app = send(data)(next);
    app.request(req, res);
    expect(res.end).to.be.calledWith(data);
  });

  it('should work with promises', () => {
    const data = new Buffer('hello');
    const app = send(Promise.resolve(data))(next);
    return app.request(req, res).then(() => {
      expect(res.end).to.be.calledWith(data);
    });
  });

  it('should work with streams', (done) => {
    const data = new Buffer('hello');
    const app = send(bl(data))(next);
    app.request(req, bl((err, result) => {
      try {
        expect(err).to.be.null;
        expect(result).to.be.equal(data);
        done();
      } catch (err) {
        done(err);
      }
    }));
  });

  it('should fail for invalid values', () => {
    expect(() => {
      send(false);
    }).to.throw(TypeError);
  });
});
