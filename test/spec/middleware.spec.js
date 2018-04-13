import {expect} from 'chai';
import sinon from 'sinon';

import middleware from '../../src/middleware';
import request from '../../src/request';
import compose from '../../src/compose';
import fetch from '../../src/test/fetch';

describe('/middleware', () => {
  it('should work with no callback', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const app = middleware((req, res) => {
      spy2(req, res);
    });
    return fetch(app, '/', {onNext: spy1}).then(() => {
      expect(spy2).to.be.called;
      expect(spy1).not.to.be.called;
    });
  });

  it('should work with basic callback', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const app = middleware((req, res, next) => {
      spy2(req, res);
      next();
    });
    return fetch(app, '/', {onNext: spy1}).then(() => {
      expect(spy2).to.be.called;
      expect(spy1).to.be.called;
    });
  });

  it('should work with error callback', () => {
    const spy1 = sinon.spy();
    const spy2 = sinon.spy();
    const spy3 = sinon.spy();
    const app = middleware((req, res, next) => {
      spy2(req, res);
      next('error');
    });
    return fetch(app, '/', {onNext: spy1, onError: spy3}).then(() => {
      expect(spy2).to.be.called;
      expect(spy1).not.to.be.called;
      expect(spy3).to.be.calledWith('error');
    });
  });

  it('should work with error thrown with no callback', () => {
    const spy1 = sinon.spy();
    const spy3 = sinon.spy();
    const app = middleware((_req, _res) => {
      throw new Error();
    });
    return fetch(app, '/', {onNext: spy1, onError: spy3}).then(() => {
      expect(spy1).not.to.be.called;
      expect(spy3).to.be.called;
    });
  });

  it('should work with error thrown with callback', () => {
    const spy1 = sinon.spy();
    const spy3 = sinon.spy();
    const app = middleware((_req, _res, _next) => {
      throw new Error();
    });
    return fetch(app, '/', {onNext: spy1, onError: spy3}).then(() => {
      expect(spy1).not.to.be.called;
      expect(spy3).to.be.called;
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
      }),
    );
    return fetch(app, '/', {onNext: spy1, onError: spy3}).then(() => {
      expect(spy2).to.be.calledWith(error);
      expect(spy1).to.be.called;
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
      }),
    );
    return fetch(app, '/', {onNext: spy1, onError: spy3}).then(() => {
      expect(spy2).to.be.calledWith(error);
      expect(spy1).not.to.be.called;
      expect(spy3).to.be.calledWith(error);
    });
  });

  it('should fail if given an invalid function', () => {
    expect(() => {
      middleware(() => {});
    }).to.throw(TypeError);
  });
});
