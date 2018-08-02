import middleware from '../../src/middleware';
import request from '../../src/request';
import compose from '../../src/compose';
import fetch from '../../src/test/fetch';

describe('/middleware', () => {
  it('should work with no callback', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const app = middleware((req, res) => {
      spy2(req, res);
    });
    await fetch(app, '/', {onNext: spy1});
    expect(spy2).toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
  });

  it('should work with basic callback', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const app = middleware((req, res, next) => {
      spy2(req, res);
      next();
    });
    await fetch(app, '/', {onNext: spy1});
    expect(spy2).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
  });

  it('should work with error callback', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();
    const app = middleware((req, res, next) => {
      spy2(req, res);
      next('error');
    });
    await fetch(app, '/', {onNext: spy1, onError: spy3});
    expect(spy2).toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should work with error thrown with no callback', async () => {
    const spy1 = jest.fn();
    const spy3 = jest.fn();
    const app = middleware((_req, _res) => {
      throw new Error();
    });
    await fetch(app, '/', {onNext: spy1, onError: spy3});
    expect(spy1).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should work with error thrown with callback', async () => {
    const spy1 = jest.fn();
    const spy3 = jest.fn();
    const app = middleware((_req, _res, _next) => {
      throw new Error();
    });
    await fetch(app, '/', {onNext: spy1, onError: spy3});
    expect(spy1).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should work with recovered error handler', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();
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
    await fetch(app, '/', {onNext: spy1, onError: spy3});
    expect(spy2).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy3).not.toHaveBeenCalled();
  });

  it('should work with failed error handler', async () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();
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
    await fetch(app, '/', {onNext: spy1, onError: spy3});
    expect(spy2).toHaveBeenCalled();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('should fail if given an invalid function', () => {
    expect(() => {
      middleware(() => {});
    }).toThrow(TypeError);
  });
});
