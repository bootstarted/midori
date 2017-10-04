import {expect} from 'chai';
import sinon from 'sinon';

import middleware from '../../src/middleware';
import request from '../../src/request';
import compose from '../../src/compose';

describe('middleware', () => {
  it('should work with no callback', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const app = middleware((req, res) => {
      spy2(req, res);
    })({request: spy1});
    app.request('foo', 'bar');
    expect(spy2).to.be.calledWith('foo', 'bar');
    expect(spy1).not.to.be.called;
  });

  it('should work with basic callback', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const app = middleware((req, res, next) => {
      spy2(req, res);
      next();
    })({request: spy1});
    return app.request('foo', 'bar').then(() => {
      expect(spy2).to.be.calledWith('foo', 'bar');
      expect(spy1).to.be.calledWith('foo', 'bar');
    });
  });

  it('should work with error callback', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const app = middleware((req, res, next) => {
      spy2(req, res);
      next('error');
    })({request: spy1, error: spy3});
    return app.request('foo', 'bar').then(() => {
      expect(spy2).to.be.calledWith('foo', 'bar');
      expect(spy1).not.to.be.called;
      expect(spy3).to.be.calledWith('error', 'foo', 'bar');
    });
  });

  it('should work with recovered error handler', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const error = new Error();
    const app = compose(
      request(() => {
        throw error;
      }),
      middleware((err, req, res, next) => {
        spy2(err, req, res);
        next();
      })
    )({request: spy1, error: spy3});
    return app.request('foo', 'bar').then(() => {
      expect(spy2).to.be.calledWith(error, 'foo', 'bar');
      expect(spy1).to.be.calledWith('foo', 'bar');
      expect(spy3).not.to.be.called;
    });
  });

  it('should work with failed error handler', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const error = new Error();
    const app = compose(
      request(() => {
        throw error;
      }),
      middleware((err, req, res, next) => {
        spy2(err, req, res);
        next(err);
      })
    )({request: spy1, error: spy3});
    return app.request('foo', 'bar').then(() => {
      expect(spy2).to.be.calledWith(error, 'foo', 'bar');
      expect(spy1).not.to.be.called;
      expect(spy3).to.be.calledWith(error, 'foo', 'bar');
    });
  });

  it('should fail if given an invalid function', () => {
    expect(() => {
      middleware(() => {});
    }).to.throw(TypeError);
  });
});
